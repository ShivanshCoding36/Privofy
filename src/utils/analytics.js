import mixpanel from 'mixpanel-browser';
import * as Sentry from '@sentry/react';

// Initialize Mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

// Google Analytics setup
export const initGA = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', process.env.REACT_APP_GA_TRACKING_ID);
  
  window.gtag = gtag;
};

// Track events
export const trackEvent = (eventName, properties = {}) => {
  // Mixpanel
  mixpanel.track(eventName, properties);
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: 'analytics',
    message: eventName,
    data: properties,
    level: 'info',
  });
};

// Identify user
export const identifyUser = (userId, userProperties = {}) => {
  // Mixpanel
  mixpanel.identify(userId);
  mixpanel.people.set(userProperties);
  
  // Sentry
  Sentry.setUser({
    id: userId,
    email: userProperties.email,
  });
}; 