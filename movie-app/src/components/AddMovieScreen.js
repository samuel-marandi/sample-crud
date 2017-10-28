import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Picker, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, CheckBox } from 'react-native-elements'
import { Button } from 'react-native-material-design';
import isLength from 'validator/lib/isLength';

import { MovieActions } from '../actions/Movie';

@connect((store) => ({ movie: store.movie }))
class AddMovieScreen extends Component{
  
  static propTypes = {
    dispatch: PropTypes.func,
    movie: PropTypes.object,
  };
  
  state = { isMovieNameInvalid: true };
  
  componentWillMount() {
    this.props.dispatch(MovieActions.resetForm())
  }
  
  showErrorStatus = (movie) => {
    this.setState({ isMovieNameInvalid: true });
    this.props.dispatch(MovieActions.updateMovieName(movie));
  };
  
  updateMovieName = (movie) => {
    this.setState({ isMovieNameInvalid: false });
    this.props.dispatch(MovieActions.updateMovieName(movie));
  };
  
  handleMovieNameChange = (movie) => (isLength(movie, { min: 2}) ?
    this.updateMovieName(movie) : this.showErrorStatus(movie));
  
  handleMovieGenreChange = (genre) => this.props.dispatch(MovieActions.updateMovieGenre(genre));
  
  handleMovieDirectorChange = (director) => this.props.dispatch(MovieActions.updateMovieDirector(director));
  
  handleMovieFavStatusChange = (favStatus) => this.props.dispatch(MovieActions.updateFavoriteStatus(favStatus));
  
  handleButtonClick = async () => {
    const { movieData, movieList } = this.props.movie;
    const { title, genre, director, favStatus } = movieData;
    const newMovie = { id: movieList.length + 1, title, genre, director, favStatus };

    this.props.dispatch(MovieActions.addMovie(newMovie));
    this.props.navigation.navigate('Splash')
  };
  
  render(){
    const { isMovieFieldPristine, movieData } = this.props.movie;
    const { title, genre, director, favStatus } = movieData;
    return (
      <View>
        <View>
          <Text style={styles.titleText}>ADD A MOVIE</Text>
        </View>
        <View style={styles.form}>
          <FormLabel>Movie Name</FormLabel>
          <FormInput value={title} onChangeText={(text)=>this.handleMovieNameChange(text)}/>
          <FormValidationMessage>
            {
              !isMovieFieldPristine && this.state.isMovieNameInvalid ?
              'Movie name should be minimum 3 characters': ''
            }
          </FormValidationMessage>
          <FormLabel>Genre</FormLabel>
          <Picker
            style={styles.picker}
            selectedValue={genre}
            onValueChange={(itemValue, itemIndex) => this.handleMovieGenreChange(itemValue)}>
            <Picker.Item label="Action" value="action" />
            <Picker.Item label="Comedy" value="comedy" />
            <Picker.Item label="Romantic Comedy" value="romcom" />
            <Picker.Item label="Thriller" value="thriller" />
          </Picker>
          <FormLabel>Directed By</FormLabel>
          <FormInput value={director} onChangeText={(text)=>this.handleMovieDirectorChange(text)}/>
          <CheckBox
            title='Mark as favorite' checked={favStatus}
            onPress={() => this.handleMovieFavStatusChange(!favStatus)}
          />
          <Button
            disabled={this.state.isMovieNameInvalid}
            overrides={{ backgroundColor: '#009fff', textColor: '#ffffff' }}
            text="ADD"
            value="NORMAL RAISED"
            raised={true}
            onPress={() => this.handleButtonClick()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    marginLeft: 10,
  },
  label: {
    marginTop: 30,
    padding: 30,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '35%',
  }
});

export default AddMovieScreen;
