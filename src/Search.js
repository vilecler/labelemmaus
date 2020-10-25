import React, { Component } from "react";
import './Search.css';

class Search extends Component {

  //ETATS valides aux USA
  validStates = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

  //Etat actuel de l'application
  state = {
    searchValue: '',  //mot clé de la recherche
    locationValue: 'AL',  //Etat de la recherche
    numberOfSchools: 0,   //nombre total de résultats
    currentPage: 1, //page actuelle de la recherche
    schools: []   //liste des ecoles trouvées
  };

  constructor(props){
    super(props);

    //On va bind toutes les méthodes liées à la gestion d'événement
    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  //RENDU
  render() {

    const schools = this.state.schools;

    return (
      <div className="main">
        <div className="header">
          <h1>Application de recherche d'école à partir de <a href="https://any-api.com/schooldigger_com/schooldigger_com/docs/_v1_schools/Schools_GetAllSchools">cette API</a>.</h1>
          <form>
            <select className="input select" name="location" onChange={event => this.handleLocationOnChange(event)} value={this.state.locationValue}>
              {this.validStates.length > 0 && (
                  this.validStates.map((validState, index) => (
                    <option key={index} value={validState}>{validState}</option>
                  ))
              )}
            </select>
            <input className="input margin" name="text" type="text" placeholder="Nom de l'école" onChange={event => this.handleQueryOnChange(event)} value={this.state.searchValue} />
            <button type="button" className="btn btn-primary btn-inside uppercase" onClick={this.handleSearch} >Chercher</button>
          </form>
        </div>
        { (this.state.numberOfSchools > 0) && ( <div className="school-number">{this.state.schools.length} de {this.state.numberOfSchools} écoles trouvées</div> ) }
        {schools.length > 0 ? (
          <div className="schools">
          {this.state.schools.map((school, index) => (
            <div className="school-item" key={index}>
              <a href={school.url}>
                <h3>{school.schoolName}</h3>
                <p>Nombre d'étudiants : <span className="student-number">{school.schoolYearlyDetails[0].numberOfStudents}</span></p>
                <p>Adresse : <span className="address">{school.address.street} {school.address.city}, {school.address.state}</span></p>
              </a>
            </div>
          ))}
          </div>
          ) : (
          <p className="no-result">Aucune école trouvée.</p>
        )}

        {(this.state.schools.length < this.state.numberOfSchools) && (
          <div className="center">
            <button type="button" className="btn btn-primary" onClick={this.loadMore}>More Results</button>
          </div>
        )}
      </div>
    );
  }

  //lorsque l'on fait une nouvelle recherche
  makeApiCall = (locationValue, searchInput) => {

    if(this.validStates.includes(locationValue)){
      //var searchUrl = 'http://www.yourprofs.fr/schools.json?q=${searchInput}';
      var searchUrl = 'https://api.schooldigger.com/v1/schools?st=' + locationValue + '&q=' + searchInput + '&perPage=10&appID=38a4ecdd&appKey=9a24e3a45e26c96a32dc66b1bcfd6110';
      console.log(searchUrl);

      fetch(searchUrl)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(jsonData => {
          console.log(jsonData);
          console.log(jsonData.schoolList);

                this.setState({ currentPage: 2 });
          this.setState({ schools: jsonData.schoolList });
          this.setState({ numberOfSchools: jsonData.numberOfSchools });

        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    }
    else{
      alert("Le pays " + locationValue + " n'est pas correct.");
    }
  };

  //lorsque que l'on veut charger plus de résultats
  makeApiCallBis = (locationValue, searchInput, page) => {

    if(this.validStates.includes(locationValue)){
      //var searchUrl = 'http://www.yourprofs.fr/schools.json?q=${searchInput}';
      var searchUrl = 'https://api.schooldigger.com/v1/schools?st=' + locationValue + '&q=' + searchInput + '&perPage=10&page=' + page + '&appID=38a4ecdd&appKey=9a24e3a45e26c96a32dc66b1bcfd6110';

      console.log(searchUrl);

      fetch(searchUrl)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(jsonData => {
          console.log(jsonData);
          console.log(jsonData.schoolList);

          this.setState({ numberOfSchools: jsonData.numberOfSchools });

          this.setState(prevState => {
             return {schools: prevState.schools.concat(jsonData.schoolList) }
          })

          this.setState(prevState => {
             return {currentPage: prevState.currentPage + 1}
          })

        })
        .catch(error => {
          console.log('Looks like there was a problem: \n', error);
        });
    }
    else{
      alert("Le pays " + locationValue + " n'est pas correct.");
    }
  };

  //GESTION DES EVENEMENTS
  handleQueryOnChange(event){
    this.setState({ searchValue: event.target.value });
  }


  handleLocationOnChange(event){
    this.setState({ locationValue: event.target.value });
  }


  handleSearch(){
    this.makeApiCall(this.state.locationValue, this.state.searchValue);
  }

  loadMore(){
    this.makeApiCallBis(this.state.locationValue, this.state.searchValue, this.state.currentPage);
  }


}

export default Search;
