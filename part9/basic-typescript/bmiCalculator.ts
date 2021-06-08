interface BmiInputValues {
  cm: number;
  kg: number;
}

const parseBmiArguments = (args: Array<string>): BmiInputValues => {
  if (!isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
    return {
      cm: Number(args[0]),
      kg: Number(args[1]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (cm: number, kg: number) => {
  const bmi = kg / Math.pow(cm / 100, 2);

  if (bmi > 30) {
    return 'Obese';
  } else if (bmi >= 25) {
    return 'Overweight';
  } else if (bmi >= 18.5) {
    return 'Normal (healthy weight)';
  } else {
    return 'Underweight';
  }
};

export default { parseBmiArguments, calculateBmi };

// try {
//   const { cm, kg } = parseBmiArguments(process.argv);
//   console.log(calculateBmi(cm, kg));
// } catch (e) {
//   console.log('Error:', e.message);
// }
