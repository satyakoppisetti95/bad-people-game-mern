import { Card } from 'react-bootstrap'
function PlayerCard(props) {
    const getInitialsFromName = (name) => {
        const names = name.split(' ')
        let initials = names[0].substring(0, 1).toUpperCase()
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase()
        }
        return initials
    }

    const player = props.player

    return (
        <Card>
            <Card.Body>
                <div
                    key={player.name}
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            height: '32px',
                            width: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#3c3c3c',
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '8px',
                        }}
                    >
                        {getInitialsFromName(player.name)}
                    </div>
                    <div>{player.name}</div>
                </div>
            </Card.Body>
        </Card>

    )
}

export default PlayerCard