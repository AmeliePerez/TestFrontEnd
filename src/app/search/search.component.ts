import { Country } from "../model/country.model";
import { CountryService } from "../service/country.service";

var selected: HTMLElement;
var previousSelected: HTMLElement;

function unselect(previousSelected: HTMLElement) {
  previousSelected.style.removeProperty("background-color");
}

function select(selected: HTMLElement) {
  selected.style.backgroundColor = "grey";
}

function getSearch(): string | null {
  return (document.getElementById("search") as HTMLInputElement).value;
}

function clearList() {
  document.getElementById("countryList")!.innerHTML = "";
}

/**
 * The search button's click event is also fired when enter is pressed in the search bar
 */
document.getElementById("search")?.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key === "Enter") {
    document.getElementById("searchButton")?.click();
  }
});

/**
 * Creates the html element containing a given country's detailed info
 * @param country
 * @param bordersNames
 */
function createDetailHTML(country: Country, bordersNames: string[]) {
  let languages: string = "";
  let currencies: string = "";
  country.languages!.forEach((language: any) => {
    languages += language.name + " ";
  });

  country.currencies!.forEach((currencie: any) => {
    currencies += currencie.name + " ";
  });

  document.getElementById("countryDetail")!.innerHTML = `
    <div class="card m-2">
    <div class="card-body"> 
        <div class="row d-flex">
        <div class="col-6 col-md-12 mb-2">
            <img
            src="${country.flag}"
            class="img-fluid"
            alt="Country flag"
            />
        </div>
        <div class="col-6 col-md-12">
        <p id="NativeName" class="card-title">Native name : ${country.nativeName}</p>
        <p id="capital" class="card-title">Capital : ${country.capital}</p>
        <p id="population" class="card-title">Population : ${country.population}</p>
        <p id="languages" class="card-title">Languages :${languages}</p>
        <p id="timeZones" class="card-title">Time zones : ${country.timezones}</p>
        <p id="cureenciesNames" class="card-title">Currencies names : ${currencies}</p>
        <p id="borderCountriesNames" class="card-title">Border countries : ${bordersNames}</p>
        </div>
        </div>
    </div>
    </div>
    `;
}

/**
 * Gets the names of border countries based on optional alpha codes in country object
 * @param country
 */
function loadCountryDetailInfo(country: Country) {
  let bordersNames: string[] = [];
  if (country.borders && country.borders.length > 0) {
    let alphaCodes: string = "";
    country.borders!.forEach((alphacode) => {
      alphaCodes += alphacode + ";";
    });
    let countryService: CountryService = new CountryService();
    countryService
      .getCountriesNamesForCountry<Country[]>(alphaCodes)
      .then((countries: Country[]) => {
        bordersNames = countries.map((countryElement) => countryElement.name);
        createDetailHTML(country, bordersNames);
      });
  } else {
    createDetailHTML(country, bordersNames);
  }
}

/**
 * When the search button is clicked a card is created for each country matching the name in the search bar
 */
document.getElementById("searchButton")?.addEventListener("click", () => {
  clearList();
  let name = getSearch();
  if (name) {
    let countryService: CountryService = new CountryService();
    countryService
      .getCountriesByName<Country[]>(name)
      .then((countries: Country[]) => {
        let parentDiv: HTMLElement = document.getElementById("countryList")!;
        countries.forEach((country) => {
          let countryElement = document.createElement("div");
          countryElement.classList.add("card");
          countryElement.classList.add("m-2");
          countryElement.setAttribute(
            "id",
            country.alpha3Code ? country.alpha3Code : ""
          );
          countryElement.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">
                        ${country.alpha3Code}
                        </h6>
                        <h5 id="countryName">${country.name}</h5>
                    </div>
                `;
          countryElement.addEventListener("click", (ev) => {
            if (selected !== countryElement) {
              if (selected) {
                previousSelected = selected;
                unselect(previousSelected);
              }
              selected = countryElement;
              select(selected);
            }
            loadCountryDetailInfo(country);
          });
          parentDiv.appendChild(countryElement);
        });
      });
  }
});
