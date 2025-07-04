'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game, Question, Option } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

interface GameEditorProps {
  game: Game;
  initialQuestions?: Question[];
  initialOptions?: Record<string, Option[]>;
}

export function GameEditor({
  game,
  initialQuestions = [],
  initialOptions = {},
}: GameEditorProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [options, setOptions] = useState<Record<string, Option[]>>(initialOptions);
  const [gameTitle, setGameTitle] = useState(game.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');
  const [editingOptions, setEditingOptions] = useState<Option[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (game.status !== 'draft') {
      router.push(`/game/${game.id}/host?status=${game.status}`);
      return;
    }
    
    if (initialQuestions.length === 0) {
      fetchQuestionsAndOptions();
    }
  }, [game.id]);

  const fetchQuestionsAndOptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('game_id', game.id)
        .order('order', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      // Fetch options for all questions
      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .in('question_id', questionsData.map(q => q.id) || []);
        
      if (optionsError) throw optionsError;
      
      // Organize options by question_id
      const optionsByQuestionId: Record<string, Option[]> = {};
      optionsData.forEach(option => {
        if (!optionsByQuestionId[option.question_id]) {
          optionsByQuestionId[option.question_id] = [];
        }
        optionsByQuestionId[option.question_id].push(option);
      });
      
      setQuestions(questionsData);
      setOptions(optionsByQuestionId);
    } catch (err) {
      console.error('Error fetching questions and options:', err);
      setError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameTitle(e.target.value);
  };

  const handleSaveTitle = async () => {
    if (!gameTitle.trim()) {
      setError('Game title cannot be empty');
      return;
    }

    try {
      const supabase = createClient();
      
      const { error: updateError } = await supabase
        .from('games')
        .update({ title: gameTitle })
        .eq('id', game.id)
        .eq('status', 'draft'); // Ensure game is still in draft state
        
      if (updateError) throw updateError;
      
      setIsEditingTitle(false);
      setError(null);
    } catch (err) {
      console.error('Error updating game title:', err);
      setError('Failed to update game title');
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) {
      setError('Question text cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Check if game is still in draft state
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('status')
        .eq('id', game.id)
        .single();
        
      if (gameError) throw gameError;
      if (gameData.status !== 'draft') {
        setError('Game is no longer in draft state');
        return;
      }
      
      // Insert new question
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert({
          game_id: game.id,
          text: newQuestionText,
          order: questions.length + 1,
        })
        .select()
        .single();
        
      if (questionError) throw questionError;
      
      // Create default options for the new question
      const optionsToInsert = Array(4).fill(null).map((_, index) => ({
        question_id: newQuestion.id,
        text: `Option ${index + 1}`,
        is_correct: index === 0, // First option is correct by default
      }));
      
      // Insert options
      const { data: newOptions, error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert)
        .select();
        
      if (optionsError) throw optionsError;
      
      // Update local state
      setQuestions([...questions, newQuestion]);
      setOptions({
        ...options,
        [newQuestion.id]: newOptions,
      });
      
      setNewQuestionText('');
      setIsAddingQuestion(false);
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Failed to add question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditingQuestionText(question.text);
    setEditingOptions(options[question.id] || []);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestionText.trim()) {
      setError('Question text cannot be empty');
      return;
    }

    // Check if at least one option is marked as correct
    if (!editingOptions.some(option => option.is_correct)) {
      setError('At least one option must be marked as correct');
      return;
    }

    // Check if all options have text
    if (editingOptions.some(option => !option.text.trim())) {
      setError('All options must have text');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Check if game is still in draft state
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('status')
        .eq('id', game.id)
        .single();
        
      if (gameError) throw gameError;
      if (gameData.status !== 'draft') {
        setError('Game is no longer in draft state');
        return;
      }
      
      // Update question
      const { error: questionError } = await supabase
        .from('questions')
        .update({ text: editingQuestionText })
        .eq('id', editingQuestionId);
        
      if (questionError) throw questionError;
      
      // Update options
      for (const option of editingOptions) {
        const { error: optionError } = await supabase
          .from('options')
          .update({
            text: option.text,
            is_correct: option.is_correct
          })
          .eq('id', option.id);
          
        if (optionError) throw optionError;
      }
      
      // Update local state
      setQuestions(questions.map(q =>
        q.id === editingQuestionId
          ? { ...q, text: editingQuestionText }
          : q
      ));
      
      setOptions({
        ...options,
        [editingQuestionId!]: editingOptions,
      });
      
      // Reset editing state
      setEditingQuestionId(null);
      setEditingQuestionText('');
      setEditingOptions([]);
      setError(null);
    } catch (err) {
      console.error('Error updating question:', err);
      setError('Failed to update question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Check if game is still in draft state
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('status')
        .eq('id', game.id)
        .single();
        
      if (gameError) throw gameError;
      if (gameData.status !== 'draft') {
        setError('Game is no longer in draft state');
        return;
      }
      
      // Delete question (options will be deleted via cascade)
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
        
      if (deleteError) throw deleteError;
      
      // Get remaining questions
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      
      // Update order of remaining questions in database
      for (let i = 0; i < updatedQuestions.length; i++) {
        const { error: updateError } = await supabase
          .from('questions')
          .update({ order: i + 1 })
          .eq('id', updatedQuestions[i].id);
          
        if (updateError) throw updateError;
        
        // Update local question order
        updatedQuestions[i].order = i + 1;
      }
      
      // Remove options for the deleted question
      const { [questionId]: _, ...remainingOptions } = options;
      
      // Update state
      setQuestions(updatedQuestions);
      setOptions(remainingOptions);
      setError(null);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...editingOptions];
    updatedOptions[index] = { ...updatedOptions[index], text };
    setEditingOptions(updatedOptions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const updatedOptions = editingOptions.map((option, i) => ({
      ...option,
      is_correct: i === index,
    }));
    setEditingOptions(updatedOptions);
  };

  const handlePublishGame = async () => {
    if (questions.length === 0) {
      setError('You need to add at least one question before publishing');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Verify all questions have 4 options with one correct answer
      for (const question of questions) {
        const questionOptions = options[question.id] || [];
        
        if (questionOptions.length !== 4) {
          setError(`Question "${question.text}" must have exactly 4 options`);
          setIsPublishing(false);
          return;
        }
        
        if (!questionOptions.some(opt => opt.is_correct)) {
          setError(`Question "${question.text}" must have one correct answer`);
          setIsPublishing(false);
          return;
        }
      }
      
      // Update game status in the database to 'lobby'
      const { error } = await supabase
        .from('games')
        .update({
          status: 'lobby',
          title: gameTitle // Ensure title is saved
        })
        .eq('id', game.id);
        
      if (error) throw error;
      
      // Redirect to the lobby view
      router.push(`/game/${game.id}/host?status=lobby`);
    } catch (err) {
      console.error('Error publishing game:', err);
      setError('Failed to publish game');
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          {isEditingTitle ? (
            <div className="flex-1">
              <Input
                value={gameTitle}
                onChange={handleTitleChange}
                className="text-2xl font-bold"
                placeholder="Enter game title"
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <Button
                  onClick={handleSaveTitle}
                  className="text-white"
                  style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setGameTitle(game.title);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{gameTitle}</h1>
              <Button
                onClick={() => setIsEditingTitle(true)}
                variant="ghost"
                className="ml-2 p-1 h-auto"
              >
                ✏️
              </Button>
            </div>
          )}
          
          <div>
            <div className="text-sm text-text-muted">Game Code</div>
            <div className="font-bold text-lg tracking-wider">{game.code}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-muted">
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </div>
          
          <Button
            onClick={handlePublishGame}
            disabled={isPublishing || isLoading || questions.length === 0}
            className="text-white"
            style={{ backgroundColor: theme.colors.primary.DEFAULT }}
          >
            {isPublishing ? 'Publishing...' : 'Publish Game'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div 
            key={question.id}
            className="bg-white rounded-xl shadow-md p-6"
          >
            {editingQuestionId === question.id ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Question Text
                  </label>
                  <Input
                    value={editingQuestionText}
                    onChange={(e) => setEditingQuestionText(e.target.value)}
                    className="w-full"
                    placeholder="Enter question text"
                    autoFocus
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Answer Options (select one correct answer)
                  </label>
                  <div className="space-y-3">
                    {editingOptions.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`option-${option.id}`}
                          name={`correct-option-${question.id}`}
                          checked={option.is_correct}
                          onChange={() => handleCorrectOptionChange(optionIndex)}
                          className="h-4 w-4"
                          style={{ accentColor: theme.colors.secondary.DEFAULT }}
                        />
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionTextChange(optionIndex, e.target.value)}
                          className="flex-1"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveQuestion}
                    className="text-white"
                    style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Question'}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingQuestionId(null);
                      setEditingQuestionText('');
                      setEditingOptions([]);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white font-medium mr-3">
                      {index + 1}
                    </div>
                    <h3 className="font-medium">{question.text}</h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEditQuestion(question)}
                      variant="ghost"
                      className="p-1 h-auto"
                      disabled={isLoading}
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => handleDeleteQuestion(question.id)}
                      variant="ghost"
                      className="p-1 h-auto text-error"
                      disabled={isLoading}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {options[question.id]?.map((option) => (
                    <div 
                      key={option.id}
                      className="p-3 rounded-lg border"
                      style={{ 
                        borderColor: option.is_correct ? theme.colors.success : theme.colors.text.light,
                        backgroundColor: option.is_correct ? theme.colors.success + '10' : 'transparent',
                      }}
                    >
                      {option.text}
                      {option.is_correct && (
                        <span className="ml-2 text-success">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isAddingQuestion ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-medium mb-4">Add New Question</h3>
            
            <div className="mb-4">
              <Input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="w-full"
                placeholder="Enter question text"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleAddQuestion}
                className="text-white"
                style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Question'}
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuestion(false);
                  setNewQuestionText('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingQuestion(true)}
            className="w-full py-3 border-dashed"
            variant="outline"
            style={{ borderColor: theme.colors.primary.light }}
            disabled={isLoading}
          >
            <span className="mr-2">+</span> Add Question
          </Button>
        )}
      </div>
    </div>
  );
}