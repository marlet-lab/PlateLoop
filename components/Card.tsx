import { StyleSheet, View, ViewProps } from 'react-native';

type CardProps = ViewProps & {
    children?: React.ReactNode;
};

export default function Card({ children, style, ...props }: CardProps) {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        // Android shadow
        elevation: 8,
    },
});
