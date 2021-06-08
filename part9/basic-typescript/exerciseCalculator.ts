interface exercisesResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface exercisesBody {
  daily_exercises: Array<string>;
  target: string;
}

interface parseExercisesOutput {
  daily_exercises: Array<number>;
  target: number;
}

// const parseExercisesArguments = (args: Array<string>): Array<number> => {
//   const input = args.slice(2);
//   for (const i of input) {
//     if (isNaN(Number(i))) {
//       console.log('i :>> ', i);
//       throw new Error('inputs need to be number!');
//     }
//   }
//   return input.map((a) => Number(a));
// };

const parseExercisesArguments = (args: exercisesBody): parseExercisesOutput => {
  const target = Number(args.target);
  if (isNaN(target)) {
    throw new Error('malformatted parameters');
  }
  const daily_exercises = args.daily_exercises.map((d) => {
    if (isNaN(Number(d))) {
      console.log('i :>> ', d);
      throw new Error('malformatted parameters');
    }
    return Number(d);
  });

  return {
    target,
    daily_exercises,
  };
};

const calculateExercises = (
  target: number,
  daily_exercises: Array<number>
): exercisesResult => {
  const average =
    daily_exercises.reduce((acc, d) => acc + d, 0) / daily_exercises.length;
  const scale = average / target;
  const rating = scale > 1 ? 3 : scale > 0.5 ? 2 : 1;
  const ratingDescription =
    rating === 3
      ? 'Good job!'
      : rating === 2
      ? 'not too bad but could be better'
      : 'you could have done better';
  return {
    periodLength: daily_exercises.length,
    trainingDays: daily_exercises.reduce((acc, d) => (d ? acc++ : acc), 0),
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

export default { parseExercisesArguments, calculateExercises };

// try {
//   const exercisesInput = parseExercisesArguments(process.argv);
//   //   console.log('exercisesInput :>> ', exercisesInput);
//   console.log(calculateExercises(exercisesInput[0], exercisesInput.slice(1)));
// } catch (e) {
//   console.log(e);
// }
