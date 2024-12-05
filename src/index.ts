import { app } from './app';

const start = async () => {
  try {
    app.listen(8000, () => {
      console.log('Listening on port 8000!');
    });
  } catch (err) {
    console.error(err);
  }
};

start();
