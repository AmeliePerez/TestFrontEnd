export class CountryService {
  /**
   * Gets all country info based on a given name
   * It can be the native name or partial name
   * @param name
   */
  getCountriesByName<T>(name: string): Promise<T> {
    return fetch(`https://restcountries.eu/rest/v2/name/${name}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      }
    );
  }

  /**
   * Gets the name of a country based on a given alpha code
   * @param alphaCodes
   */
  getCountriesNamesForCountry<T>(alphaCodes: string): Promise<T> {
    return fetch(
      `https://restcountries.eu/rest/v2/alpha?codes=${alphaCodes}&fields=name;`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>;
    });
  }
}
