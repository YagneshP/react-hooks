// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

// ErrorBoundary

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    if (this.state.error) {
      return <this.props.FallBackComponent error={this.state.error} />
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({...state, status: 'pending'})
    fetchPokemon(pokemonName)
      .then(data => {
        setState({...state, pokemon: data, status: 'resolved'})
      })
      .catch(err => {
        setState({...state, error: err, status: 'rejected'})
      })
  }, [pokemonName])

  const {pokemon, error, status} = state

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    throw new Error('This should be impossible')
  }
}
function ErrorFallback({error}) {
  return (
    <div>
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
    </div>
  )
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallBackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
