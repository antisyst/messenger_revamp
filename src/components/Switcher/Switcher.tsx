import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './Switcher.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <div className="switch-container">
        <motion.div
          className="switch"
          initial={isEnglish ? { x: 0 } : { x: '47px' }}
          animate={isEnglish ? { x: 0 } : { x: '47px' }}
          transition={{ type: 'tween', duration: 0.1 }}
        />
        <div
          className={`language-option ${isEnglish ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          EN
        </div>
        <div
          className={`language-option ${!isEnglish ? 'active' : ''}`}
          onClick={() => handleLanguageChange('ru')}
        >
          RU
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;