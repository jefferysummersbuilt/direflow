const asyncScriptLoader = require('./helpers/asyncScriptLoader.js').default;

const includeReact = async () => {
  try {
    await asyncScriptLoader(
      'https://unpkg.com/react@16/umd/react.production.min.js',
      'reactBundleLoaded',
    );
    await asyncScriptLoader(
      'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
      'reactBundleLoaded',
    );
  } catch (error) {
    console.error(error);
  }
};

const includeIndex = () => {
  try {
    require('{{pathIndex}}');
  } catch (error) {
    console.warn('File is not found: {{pathIndex}}');
  }
};

setTimeout(async () => {
  if (process.env.NODE_ENV === 'development' || (window.React && window.ReactDOM)) {
    includeIndex();
    return;
  }

  await includeReact();

  try {
    await new Promise((resolve, reject) => {
      let intervalCounts = 0;

      const interval = setInterval(() => {
        if (intervalCounts >= 2500) {
          reject(new Error('Direflow Error: React & ReactDOM was unable to load'));
        }

        if (window.React && window.ReactDOM) {
          clearInterval(interval);
          resolve();
        }

        intervalCounts += 1;
      });
    });

    includeIndex();
  } catch (error) {
    console.error(error.message);
  }
});