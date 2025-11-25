const API_URLS = {
  auth: 'https://functions.poehali.dev/4094fd02-32b8-41ae-8ea2-c41d18665c10',
  events: 'https://functions.poehali.dev/ae995dd8-5e16-43d8-a83d-3774d820c907',
  flights: 'https://functions.poehali.dev/d85bdbf1-b984-4bcc-a672-0a49f5f5dfbf',
  pilots: 'https://functions.poehali.dev/19aa3fea-92f1-468e-ac32-2c9f10433792'
};

export async function login(type: 'pilot' | 'admin', pid: string, password: string) {
  const response = await fetch(API_URLS.auth, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, pid, password })
  });
  return response.json();
}

export async function getEvents() {
  const response = await fetch(API_URLS.events);
  return response.json();
}

export async function getPilots() {
  const response = await fetch(API_URLS.pilots);
  return response.json();
}

export async function bookFlight(flightId: string, pilotPid: string) {
  const response = await fetch(API_URLS.flights, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'book', flightId, pilotPid })
  });
  return response.json();
}

export async function cancelBooking(flightId: string, pilotPid: string) {
  const response = await fetch(API_URLS.flights, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'cancel', flightId, pilotPid })
  });
  return response.json();
}

export async function completeFlight(flightId: string) {
  const response = await fetch(API_URLS.flights, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'complete', flightId })
  });
  return response.json();
}

export async function failFlight(flightId: string) {
  const response = await fetch(API_URLS.flights, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'fail', flightId })
  });
  return response.json();
}
