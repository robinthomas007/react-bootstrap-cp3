import * as React from 'react';

export default function Test() {

    React.useEffect(() => {
        console.log('MOUNTED');
        return () => console.log('UNMOUNTED');
    });


    return (
        <div>
            hi
        </div>
    );
}