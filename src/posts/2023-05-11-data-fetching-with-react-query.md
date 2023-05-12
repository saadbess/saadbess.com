---
title: 'Data fetching with TanStack Query'
description: 'A quick example on how to fetch data from an API using TanStack Query (previously React Query).'
date: 2023-05-11
tags:
  - react
  - react query
  - tanstack query
  - javascript
  - data fetching
  - technical
---

In this example, we're using the `useQuery` hook from [TanStack Query](https://tanstack.com/query/v3/) (previously React Query) to fetch data from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) based on the `userId` state. We're also using the `useState` hook to allow the user to change the `userId` and refetch the data.

The `useQuery` hook takes two arguments: a unique key for the query, and an `async` function that returns the data. In this case, we're using the `userId` as the key and fetching the user data from the API using fetch.

TanStack Query will automatically cache the data and update it in the background based on a set of default options. If you want to customize these options, you can pass them as a third argument to `useQuery`.

```jsx
import {useState} from 'react';
import {useQuery} from 'react-query';

function App() {
  const [userId, setUserId] = useState(1);

  const {isLoading, error, data} = useQuery('userData', async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      <label htmlFor="userId">User ID:</label>
      <input
        id="userId"
        type="number"
        value={userId}
        onChange={event => setUserId(event.target.value)}
      />
      <p>
        Name: {data.name}
        <br />
        Email: {data.email}
      </p>
    </div>
  );
}

export default App;
```
