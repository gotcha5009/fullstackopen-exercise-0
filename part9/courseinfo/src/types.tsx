export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

export interface CourseWithDescription extends CoursePartBase {
  description: string;
}

export interface CourseNormalPart extends CourseWithDescription {
  type: 'normal';
}
export interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

export interface CourseSubmissionPart extends CourseWithDescription {
  type: 'submission';
  exerciseSubmissionLink: string;
}

export interface CourseSpecialPart extends CourseWithDescription {
  type: 'special';
  requirements: string[];
}

export type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;
