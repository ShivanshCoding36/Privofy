import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const githubUsername =
          user.user_metadata?.login ||
          user.user_metadata?.user_name ||
          user.user_metadata?.name;

        if (githubUsername) {
          await supabase.auth.updateUser({
            data: {
              display_name: githubUsername
            }
          });
        }
      }

      navigate("/dashboard");
    };

    handleOAuth();
  }, [navigate]);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
