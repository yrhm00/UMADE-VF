import { render, screen, waitFor } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('affiche le statut mocké renvoyé par msw', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText(/Statut API/)).toBeTruthy());
    expect(screen.getByText('Statut API : OK (msw)')).toBeTruthy();
  });
});
