import rawData from '../Food.json';
import { Food, Cuisine } from './types';

export const foods: Food[] = rawData.foods as Food[];
export const cuisines: Cuisine[] = rawData.cuisines as Cuisine[];
