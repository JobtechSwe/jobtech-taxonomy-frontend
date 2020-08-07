import React from 'react';
import Constants from './context/constants.jsx';
import Localization from './context/localization.jsx';
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
            if(this.saveUser) {
                localStorage.setItem("taxonomy_user", this.userId);
            }
            this.props.onSetUserId(this.userId);
        }
    }

    render() {
        return (
            <div className="login_container">
                <div className="login_panel">
                    <Label text={Localization.get("app_name")} css="login_title"/>
                    <div className="sub_panel">
                        <Label text={Localization.get("set_user_id")}/>
                        <input onChange={this.onChangeUserId.bind(this)}/>
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