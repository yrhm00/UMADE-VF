import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
