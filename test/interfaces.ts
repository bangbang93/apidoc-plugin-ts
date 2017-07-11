export interface Employer {
  /**
   * The job title string
   */
  jobTitle: string;
  /**
   * The IPerson Interface
   */
  person: Person;
  /**
   * An array of ISkill interfaces
   */
  skills: Skill[];
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
   * The Address Object
   */
  address: {
    /**
     * Address line 1
     */
    address_line_1: string;
    /**
     * Postcode
     */
    postcode: number;
    /**
     * Location
     */
    location: Location
  };
}

export interface Skill {
  description: string;
  level: number;
}

export interface Location {
  /**
   * Country
   */
  country: string;
  city: string;
  region: {
    a: string;
    /**
     * b prop
     */
    b: string;
  };
}
