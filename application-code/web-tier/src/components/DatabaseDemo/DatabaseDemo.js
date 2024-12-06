import React, { Component } from 'react';
import './DatabaseDemo.css';

class DatabaseDemo extends Component {

    constructor(props) {
        super(props); 
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleButtonClickDel = this.handleButtonClickDel.bind(this);
        this.state = { 
            transactions: [],
            text_amt: "",
            text_desc: ""
        };
    }

    componentDidMount() {
        this.populateData();
    }

    // Fetch data from the backend and populate the transactions table
    populateData() {
        this.fetch_retry('http://localhost:4000/transaction', 3)
            .then(res => res.json())
            .then((data) => {
                this.setState({ transactions: data.result });
                console.log("state set");
                console.log(this.state.transactions);
            })
            .catch(console.log);
    }

    // Retry function for handling failed API calls
    async fetch_retry(url, n) {
        try {
            return await fetch(url);
        } catch (err) {
            if (n === 1) throw err;
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            return await this.fetch_retry(url, n - 1);
        }
    };

    // Render each transaction row
    renderTableData() {
        return this.state.transactions.map((transaction, index) => {
            const { id, amount, description } = transaction;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{amount}</td>
                    <td>{description}</td>
                </tr>
            );
        });
    }

    // Handle the delete button click
    handleButtonClickDel() {
        // Make sure to delete specific transaction, otherwise you'll need to add logic to handle that.
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('http://localhost:4000/transaction', requestOptions)
            .then(response => response.json())
            .then(() => this.populateData()); // Re-fetch data after deletion

        this.setState({ text_amt: "", text_desc: "" });
    }

    // Handle the add transaction button click
    handleButtonClick() {
        // Basic input validation
        if (!this.state.text_amt || !this.state.text_desc) {
            alert("Both amount and description are required.");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: this.state.text_amt,
                desc: this.state.text_desc
            })
        };

        fetch('http://localhost:4000/transaction', requestOptions)
            .then(response => response.json())
            .then(() => this.populateData()); // Re-fetch data after adding transaction

        // Reset text fields after adding transaction
        this.setState({ text_amt: "", text_desc: "" });
    }

    // Handle text input changes
    handleTextChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div>
                <h1 id="title" style={{ paddingRight: "1em" }}>
                    Aurora Database Demo Page
                </h1>
                <input
                    style={{ float: "right", marginBottom: "1em" }}
                    type="button"
                    value="DEL"
                    onClick={this.handleButtonClickDel}
                />
                <table id="transactions">
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td>AMOUNT</td>
                            <td>DESC</td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="button"
                                    value="ADD"
                                    onClick={this.handleButtonClick}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="text_amt"
                                    value={this.state.text_amt}
                                    onChange={this.handleTextChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="text_desc"
                                    value={this.state.text_desc}
                                    onChange={this.handleTextChange}
                                />
                            </td>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DatabaseDemo;
