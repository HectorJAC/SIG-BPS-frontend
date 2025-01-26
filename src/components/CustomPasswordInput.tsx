import { useState, FC } from "react";
import { Form, Button } from "react-bootstrap";

interface CustomPasswordInputProps {
    nameLabel: string;
    password: string;
    name: string;
    readonly: boolean;
    onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomPasswordInput: FC<CustomPasswordInputProps> = ({nameLabel, password, name, readonly, onchange}) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>{nameLabel}</Form.Label>
            <div className="input-group">
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={password}
                    readOnly={readonly}
                    onChange={onchange}
                />
                <Button 
                    variant="outline-secondary" 
                    onClick={togglePasswordVisibility}
                    disabled={readonly}
                >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
                </div>
        </Form.Group>
    )
};