import express, { Request } from 'express';
import Bmi from './bmiCalculator';
import Exercises from './exerciseCalculator';
const app = express();

interface bmiQuery {
  weight: string;
  height: string;
}

interface exercisesBody {
  daily_exercises: Array<string>;
  target: string;
}

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get(
  '/bmi',
  (req: Request<unknown, unknown, unknown, bmiQuery>, res): any => {
    try {
      if (!req.query.height || !req.query.weight) {
        return res.json({
          error: 'malformatted parameters',
        });
      }
      const height = req.query.height;
      const weight = req.query.weight;
      const { cm, kg } = Bmi.parseBmiArguments([height, weight]);
      const bmi = Bmi.calculateBmi(cm, kg);
      res.json({
        weight: kg,
        height: cm,
        bmi,
      });
    } catch (e) {
      // console.log(e);
      res.json({
        error: 'malformatted parameters',
      });
    }
  }
);

app.post(
  '/exercises',
  (req: Request<unknown, unknown, exercisesBody>, res): any => {
    try {
      if (!req.body.daily_exercises || !req.body.target) {
        return res.json({
          error: 'parameters missing',
        });
      }
      const { daily_exercises, target } = Exercises.parseExercisesArguments(
        req.body
      );
      const result = Exercises.calculateExercises(target, daily_exercises);
      res.json(result);
    } catch (e) {
      res.json({
        error: 'malformatted parameters',
      });
    }
  }
);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
