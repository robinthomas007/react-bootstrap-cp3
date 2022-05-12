import React from 'react'
import Button from 'react-bootstrap/Button';

type buttonProps = {
    variant: string,
    label: any,
    className?: string
    startIcon?: any
    handleClick?: any
    type?: any
}
const button = (props: buttonProps) => {
    return (
        <Button type={props.type || 'button'} onClick={props.handleClick} className={props.className} variant={props.variant}>{props.startIcon ? props.startIcon : ''} {props.label}</Button>
    )
}

export default button
