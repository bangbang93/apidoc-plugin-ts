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
