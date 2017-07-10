export interface Employer {
  /**
   * The job title string
   */
  jobTitle: string;
  /**
   * The person object
   */
  person: Person;
}

export interface Person {
  /**
   * The name of the person
   */
  name: string;
  /**
   * The age of the person
   */
  age: number;
  /**
   * The persons Address
   */
  address: string;
}
