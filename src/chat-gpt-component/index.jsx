import { useEffect, useRef, useState } from "react"
import './styles.css'

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false)
    const displayRef = useRef();
    useEffect(()=>{
        if(displayRef.current){
            displayRef.current.scrollTop = displayRef.current.scrollHeight;
        }
    }, [messages])
    async function handleSendMessage() {
        setLoading(true);
        try {
            const prompt = `$\nUser: ${inputValue}\nAssistant:`
            const url = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({
                    inputs: [prompt],
                    max_length: 2000
                })
            });
            const data = await response.json();
            // const assistantResponse = data.split();
            const assistantResponse = data[0][0]['generated_text'].split('\n')[2].split(' ').slice(1).join(' ');
            console.log(assistantResponse);
            if (assistantResponse) {
                let temp = { user: inputValue, bot: assistantResponse };
                setMessages([...messages, temp])
                setLoading(false);
                setInputValue('')
            }
        } catch (e) {
            console.log(e);
            setLoading(false)
        }
    }

    function handleKeyDown(e){
        if(e.key === 'Enter'){
            handleSendMessage();
        }
        // console.log(e.key);
    }

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-app">
                <h1 className="chatbot-title">Chat with the bot</h1>
                <div className="chat-interface">
                    <div className="display-container" ref={displayRef}>
                        {
                            messages && messages.length ?
                                messages.map((item,index) => <div className="message-block" key={index}>
                                    <p className="user-message">{item.user}</p>
                                    <p className="bot-message">{item.bot}</p>
                                </div>)
                                : null
                        }
                        {
                            loading ? <p style={{textAlign:'center'}}>Loading...</p> : null
                        }
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            name='input-text'
                            value={inputValue}
                            placeholder="Enter your inquiry..."
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e)=> handleKeyDown(e)}
                        />
                        <button className="submit-btn" onClick={handleSendMessage}>
                            <img alt='send' src="https://cdn-icons-png.flaticon.com/128/2983/2983788.png" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}