import React from 'react';
import { inject } from 'mobx-react'

//material
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

@inject('routing')
class TitlePage extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        const { push } = this.props.routing
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <FlatButton
                            label="Brand Matching"
                            onTouchTap={() => {
                                push('/brandmatching')
                            }}
                        />
                        <FlatButton
                            label="Location Matching"
                            onTouchTap={() => {
                                push('/customermatching')
                            }}
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default TitlePage;
