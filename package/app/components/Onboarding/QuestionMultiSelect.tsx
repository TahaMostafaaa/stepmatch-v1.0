/**
 * Question Multi Select Component
 * 
 * Renders a multi-select question with checkbox options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Question, QuestionOption, UserResponse } from '../../types/onboarding';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface QuestionMultiSelectProps {
  question: Question;
  response?: UserResponse;
  onSelect: (optionIds: string[]) => Promise<void>;
  disabled?: boolean;
}

const QuestionMultiSelect: React.FC<QuestionMultiSelectProps> = ({
  question,
  response,
  onSelect,
  disabled = false,
}) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    response?.option_ids || []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (response?.option_ids && response.option_ids.length > 0) {
      setSelectedOptionIds(response.option_ids);
    }
  }, [response]);

  const handleToggle = async (optionId: string) => {
    if (disabled || isSaving) return;

    const newSelection = selectedOptionIds.includes(optionId)
      ? selectedOptionIds.filter((id) => id !== optionId)
      : [...selectedOptionIds, optionId];

    setSelectedOptionIds(newSelection);
    setIsSaving(true);

    try {
      await onSelect(newSelection);
    } catch (error) {
      // Revert selection on error
      setSelectedOptionIds(response?.option_ids || []);
      console.error('Error saving selection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Sort options by display_order
  const sortedOptions = [...question.options].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text
          style={[
            FONTS.h5,
            { color: theme.dark ? colors.title : COLORS.title },
            styles.questionText,
          ]}
        >
          {question.question_text}
        </Text>
        {question.is_required && (
          <Text style={[styles.requiredIndicator, { color: COLORS.danger }]}>
            *
          </Text>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {sortedOptions.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const isDisabled = disabled || isSaving;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                {
                  backgroundColor: theme.dark
                    ? 'rgba(255,255,255,.05)'
                    : COLORS.light,
                  borderColor: isSelected
                    ? COLORS.primary
                    : colors.borderColor,
                },
                isSelected && styles.optionItemSelected,
                isDisabled && styles.optionItemDisabled,
              ]}
              onPress={() => handleToggle(option.id)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected
                        ? COLORS.primary
                        : colors.text,
                      backgroundColor: isSelected
                        ? COLORS.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    FONTS.font,
                    {
                      color: isSelected
                        ? colors.title
                        : colors.text,
                      flex: 1,
                    },
                  ]}
                >
                  {option.option_text}
                </Text>
                {isSaving && isSelected && (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={styles.loadingIndicator}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin * 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin,
  },
  questionText: {
    flex: 1,
    marginRight: 4,
  },
  requiredIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  optionsContainer: {
    gap: SIZES.margin / 2,
  },
  optionItem: {
    borderWidth: 2,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minHeight: 56,
  },
  optionItemSelected: {
    borderWidth: 2,
  },
  optionItemDisabled: {
    opacity: 0.6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.margin,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginLeft: 'auto',
  },
});

export default QuestionMultiSelect;

