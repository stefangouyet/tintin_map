import { TimelineOppositeContent } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import * as React from 'react';

const TimelineComponent = ({ data, selectedBook, handleSelectedBookClick, handleSetHoverBook, hoverBook }) => {
    return (
        <Timeline
            position="alternate-reverse"
            style={{
                padding: 0,
            }}
        >
            <div style={{ padding: '1em', textAlign: 'center' }}>
                <h3>
                    Tintin's Whereabouts (1930 - 1976)
                </h3>
            </div>
            {data.map(book => {
                const imgStorage = book.properties &&
                    "https://storage.googleapis.com/tintin-map.appspot.com/images/" +
                    book.properties["FR_Name"]
                        .toString()
                        .replace(" ", "%20")
                        .replace("Î", "I%CC%82")
                        .replace("é", "e%CC%81")
                        .replace("É", "E%CC%81") +
                    ".jpeg"
                return (
                    <div onClick={() =>
                        handleSelectedBookClick(book)
                    }
                        id={book.properties?.EN_Name}
                        onMouseEnter={() => handleSetHoverBook(book)}
                        onMouseLeave={() => handleSetHoverBook(null)}
                    >
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                align="right"
                                variant="body2"
                                color={book.properties?.EN_Name === selectedBook?.properties.EN_Name || book.properties?.EN_Name === hoverBook ? "text.primary" : 'text.secondary'}
                                style={{
                                    padding: '6px 10px 6px 16px',
                                    maxWidth: '20%'
                                }}
                            >
                                {book.properties && book.properties['Year Completed']}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent
                            >
                                <img
                                    className="photo"
                                    alt=""
                                    src={imgStorage}
                                    style={{ opacity: book.properties?.EN_Name === selectedBook?.properties.EN_Name || book.properties?.EN_Name === hoverBook ? 1 : 0.4 }}
                                />
                            </TimelineContent>
                        </TimelineItem>
                    </div>
                )
            })}
        </Timeline>
    )
}

export default TimelineComponent;