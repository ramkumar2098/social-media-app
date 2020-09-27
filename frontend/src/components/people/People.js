import React, { useEffect, useState, useRef } from 'react'
import Person from './person/Person'
import Spinner from 'components/spinner/Spinner'
import style from './People.module.css'

function People({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [people, setPeople] = useState([])

  const peopleRef = useRef()

  useEffect(() => {
    fetch('/people')
      .then(response => response.json())
      .then(people => {
        setPeople(people)
        peopleRef.current = people
      })
      .catch(console.log)
  }, [])

  const [query, setQuery] = useState('')

  const handleChange = e => {
    setQuery(e.target.value)

    const query = e.target.value.trim().toLowerCase()
    const people = peopleRef.current

    if (!query) return setPeople(people)

    const _people = people.filter(({ name }) =>
      name.toLowerCase().includes(query)
    )
    setPeople(_people)
  }

  return (
    <div className={style.people}>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Type to search"
        className={style.query}
      />
      {people.length > 0 ? (
        people.map(person => <Person key={person._id} person={person} />)
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default People
