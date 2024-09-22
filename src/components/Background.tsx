import './styles/background.css';

interface BackgroundProps {
    children: React.ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
    return (
        <div className='fondo'>
            {children}
        </div>
    );
}