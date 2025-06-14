
import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SettingsProps {
  settings: {
    subject: string;
    difficulty: string;
    questionCount: number;
    timeLimit: number;
    autoSubmit: boolean;
    showExplanations: boolean;
    soundEffects: boolean;
  };
  onUpdateSettings: (settings: any) => void;
  onSaveSettings: () => void;
  onNavigate: (view: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onSaveSettings,
  onNavigate
}) => {
  const updateSetting = (key: string, value: any) => {
    onUpdateSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full">
            <SettingsIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Quiz Settings</h1>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Quiz Subject */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Quiz Subject</label>
          <Select value={settings.subject} onValueChange={(value) => updateSetting('subject', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Literature">Literature</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Level */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => updateSetting('difficulty', level)}
                className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                  settings.difficulty === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Configuration */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Configuration</h3>
          <div className="space-y-4">
            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
              <Select value={settings.questionCount.toString()} onValueChange={(value) => updateSetting('questionCount', parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <Select value={settings.timeLimit.toString()} onValueChange={(value) => updateSetting('timeLimit', parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="5">5 Minutes</SelectItem>
                  <SelectItem value="10">10 Minutes</SelectItem>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="20">20 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="0">No Time Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Settings</h3>
          <div className="space-y-4">
            {/* Auto Submit */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Auto Submit Quiz</p>
                <p className="text-sm text-gray-500">Automatically submit when time runs out</p>
              </div>
              <button
                onClick={() => updateSetting('autoSubmit', !settings.autoSubmit)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.autoSubmit ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.autoSubmit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Explanations */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Show Explanations</p>
                <p className="text-sm text-gray-500">Display AI explanations after quiz</p>
              </div>
              <button
                onClick={() => updateSetting('showExplanations', !settings.showExplanations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.showExplanations ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.showExplanations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Sound Effects</p>
                <p className="text-sm text-gray-500">Play sounds for correct/incorrect answers</p>
              </div>
              <button
                onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.soundEffects ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onSaveSettings}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
