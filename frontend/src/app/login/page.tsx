import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { handleSignInWithGoogle } from "./actions";

const Login = () => {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignInWithGoogle}>
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
