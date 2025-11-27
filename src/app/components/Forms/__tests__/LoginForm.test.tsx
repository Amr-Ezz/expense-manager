import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useAuth } from '../../../../hooks/useAuth';
import { toast } from 'react-toastify';

jest.mock('../../../../hooks/useAuth');
jest.mock('react-toastify');
jest.mock('../../../utils/sampleData', () => ({
  defaultTransactions: [],
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders login form correctly', () => {
    render(<LoginForm onClose={mockOnClose} />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });



  it('shows validation error for short password', async () => {
    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('calls login function with correct credentials on successful submission', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Login successful 🎉", expect.any(Object));
    });
  });

  it('shows error toast on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('changes button text to "Logging in..." during submission', async () => {
    // Make login promise never resolve immediately to check loading state
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in.../i })).toBeInTheDocument();
    
    await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
    });
  });
});
