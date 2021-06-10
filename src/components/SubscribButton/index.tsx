import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();

    function handleSubscribe() {
        if(!session) {
            signIn('github')
            return;
        }

        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data;
            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId })
        } catch (err) {
            alert(err.message);            
        }

    }
    return (
        <button
            type="button"
            className={ styles.subscribButton }
            onClick={ handleSubscribe }
        >
            Subscribe now
        </button>
    )
}