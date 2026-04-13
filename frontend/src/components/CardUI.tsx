import React, { useState } from 'react';

const DEFAULT_CARDS =
[
  'Roy Campanella',
  'Paul Molitor',
  'Tony Gwynn',
  'Dennis Eckersley',
  'Reggie Jackson',
  'Gaylord Perry',
  'Buck Leonard',
  'Rollie Fingers',
  'Charlie Gehringer',
  'Wade Boggs',
  'Carl Hubbell',
  'Dave Winfield',
  'Jackie Robinson',
  'Ken Griffey, Jr.',
  'Al Simmons',
  'Chuck Klein',
  'Mel Ott',
  'Mark McGwire',
  'Nolan Ryan',
  'Ralph Kiner',
  'Yogi Berra',
  'Goose Goslin',
  'Greg Maddux',
  'Frankie Frisch',
  'Ernie Banks',
  'Ozzie Smith',
  'Hank Greenberg',
  'Kirby Puckett',
  'Bob Feller',
  'Dizzy Dean',
  'Joe Jackson',
  'Sam Crawford',
  'Barry Bonds',
  'Duke Snider',
  'George Sisler',
  'Ed Walsh',
  'Tom Seaver',
  'Willie Stargell',
  'Bob Gibson',
  'Brooks Robinson',
  'Steve Carlton',
  'Joe Medwick',
  'Nap Lajoie',
  'Cal Ripken, Jr.',
  'Mike Schmidt',
  'Eddie Murray',
  'Tris Speaker',
  'Al Kaline',
  'Sandy Koufax',
  'Willie Keeler',
  'Pete Rose',
  'Robin Roberts',
  'Eddie Collins',
  'Lefty Gomez',
  'Lefty Grove',
  'Carl Yastrzemski',
  'Frank Robinson',
  'Juan Marichal',
  'Warren Spahn',
  'Pie Traynor',
  'Roberto Clemente',
  'Harmon Killebrew',
  'Satchel Paige',
  'Eddie Plank',
  'Josh Gibson',
  'Oscar Charleston',
  'Mickey Mantle',
  'Cool Papa Bell',
  'Johnny Bench',
  'Mickey Cochrane',
  'Jimmie Foxx',
  'Jim Palmer',
  'Cy Young',
  'Eddie Mathews',
  'Honus Wagner',
  'Paul Waner',
  'Grover Alexander',
  'Rod Carew',
  'Joe DiMaggio',
  'Joe Morgan',
  'Stan Musial',
  'Bill Terry',
  'Rogers Hornsby',
  'Lou Brock',
  'Ted Williams',
  'Bill Dickey',
  'Christy Mathewson',
  'Willie McCovey',
  'Lou Gehrig',
  'George Brett',
  'Hank Aaron',
  'Harry Heilmann',
  'Walter Johnson',
  'Roger Clemens',
  'Ty Cobb',
  'Whitey Ford',
  'Willie Mays',
  'Rickey Henderson',
  'Babe Ruth'
];

function getLocalCards(): string[]
{
  const storedCards = localStorage.getItem('local_cards');
  if (!storedCards)
  {
    localStorage.setItem('local_cards', JSON.stringify(DEFAULT_CARDS));
    return [...DEFAULT_CARDS];
  }

  return JSON.parse(storedCards);
}

function saveLocalCards(cards: string[]): void
{
  localStorage.setItem('local_cards', JSON.stringify(cards));
}

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
      const currentCards = getLocalCards();
      currentCards.push(card);
      saveLocalCards(currentCards);
      setMessage('Card has been added');
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
      const currentCards = getLocalCards();
      const filteredCards = currentCards.filter((cardName) =>
        cardName.toLowerCase().includes(search.toLowerCase().trim())
      );

      let resultText = '';
      for (let i = 0; i < filteredCards.length; i++)
      {
        resultText += filteredCards[i];
        if (i < filteredCards.length - 1)
        {
          resultText += ', ';
        }
      }

      setResults('Card(s) have been retrieved');
      setCardList(resultText);
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
