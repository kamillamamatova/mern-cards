import React, { useState } from 'react';

function CardUI()
{
  const storedUser = localStorage.getItem('user_data');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId: string = parsedUser ? parsedUser.id : '';

  const [message, setMessage] = useState('');
  const [searchResults, setResults] = useState('');
  const [cardList, setCardList] = useState('');
  const [search, setSearchValue] = React.useState('');
  const [card, setCardNameValue] = React.useState('');

  function handleSearchTextChange(e: any): void
  {
    setSearchValue(e.target.value);
  }

  function handleCardTextChange(e: any): void
  {
    setCardNameValue(e.target.value);
  }

  async function addCard(e: any): Promise<void>
  {
    e.preventDefault();

    if (!userId)
    {
      setMessage('User is not logged in');
      return;
    }

    const obj = { userId: userId, card: card };
    const js = JSON.stringify(obj);

    try
    {
      const response = await fetch('http://localhost:5000/api/addcard',
      {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const txt = await response.text();
      const res = JSON.parse(txt);

      if (res.error.length > 0)
      {
        setMessage('API Error: ' + res.error);
      }
      else
      {
        setMessage('Card has been added');
      }
    }
    catch (error: any)
    {
      setMessage(error.toString());
    }
  }

  async function searchCard(e: any): Promise<void>
  {
    e.preventDefault();

    if (!userId)
    {
      setResults('User is not logged in');
      return;
    }

    const obj = { userId: userId, search: search };
    const js = JSON.stringify(obj);

    try
    {
      const response = await fetch('http://localhost:5000/api/searchcards',
      {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const txt = await response.text();
      const res = JSON.parse(txt);
      const _results = res.results;

      let resultText = '';
      for (let i = 0; i < _results.length; i++)
      {
        resultText += _results[i];
        if (i < _results.length - 1)
        {
          resultText += ', ';
        }
      }

      setResults('Card(s) have been retrieved');
      setCardList(resultText);
    }
    catch (error: any)
    {
      alert(error.toString());
      setResults(error.toString());
    }
  }

  return (
    <div id="cardUIDiv">
      <br />
      Search:{' '}
      <input
        type="text"
        id="searchText"
        placeholder="Card To Search For"
        onChange={handleSearchTextChange}
      />
      <button
        type="button"
        id="searchCardButton"
        className="buttons"
        onClick={searchCard}
      >
        Search Card
      </button><br />
      <span id="cardSearchResult">{searchResults}</span>
      <p id="cardList">{cardList}</p><br /><br />

      Add:{' '}
      <input
        type="text"
        id="cardText"
        placeholder="Card To Add"
        onChange={handleCardTextChange}
      />
      <button
        type="button"
        id="addCardButton"
        className="buttons"
        onClick={addCard}
      >
        Add Card
      </button><br />
      <span id="cardAddResult">{message}</span>
    </div>
  );
}

export default CardUI;
