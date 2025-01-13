export const appConfig = {
  supportedPlatforms: ['github.com', 'gitlab.com'],
  filesToLook: ['package.json', 'composer.json'],
  supportedPackageManagers: ['npm', 'composer'],
  scheduleTimeIntervalInMinutes: 1440, // 24 hours
  mailSubject: 'Deprecated Packages Notification',
};
