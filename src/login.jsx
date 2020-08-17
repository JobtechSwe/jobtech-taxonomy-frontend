import React from 'react';
import App from './context/app.jsx';
import Constants from './context/constants.jsx';
import Localization from './context/localization.jsx';
import Rest from './context/rest.jsx';
import Button from './control/button.jsx';
import Label from './control/label.jsx';

class Login extends React.Component { 

	constructor() {
        super();
    }

    onChangeUserId(e) {
        this.userId = e.target.value;
    }

    onRememberLoginChanged(e) {
        this.saveUser = e.target.checked;
    }

    onSetUserId() {
        if(this.userId != null) {
            Constants.REST_API_KEY = this.userId;
            Rest.getConcept("dwm2_1V3_MpP", ()=>{
                if(this.saveUser) {
                    localStorage.setItem("taxonomy_user", this.userId);
                }
                this.props.onSetUserId(this.userId);
            }, ()=>{
                Constants.REST_API_KEY = "";
                App.showError(Localization.get("invalid_user_id"));
            });
        }
    }

    onKeyUp(e) {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            this.onSetUserId();
        }
    }

    render() {
        return (
            <div className="login_container">
                <div className="login_panel">
                    <Label text={Localization.get("app_name")} css="login_title"/>
                    <div className="sub_panel">
                        <Label text={Localization.get("set_user_id")}/>
                        <input onChange={this.onChangeUserId.bind(this)} onKeyUp={this.onKeyUp.bind(this)}/>
                        <div className="login_remember">
                            <Label text={Localization.get("remember")}/>
                            <input 
                                type="checkbox"
                                onChange={this.onRememberLoginChanged.bind(this)}/>
                        </div>
                        <div className="login_buttons">
                            <Button onClick={this.onSetUserId.bind(this)} text={Localization.get("use")}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;