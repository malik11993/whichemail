import * as LocalAuthentication from 'expo-local-authentication';
import {Alert} from 'react-native';
import {showToast} from '@/utils/toast';

export type AuthPurpose =
    | 'view-password'
    | 'copy-password'
    | 'edit-password'
    | 'save-password'
    | 'delete-password'
    | 'enable-password'
    | 'access-settings';

interface AuthenticationOptions {
    purpose?: AuthPurpose;
    customMessage?: string;
    showSuccessToast?: boolean;
    successMessage?: string;
}

interface AuthenticationResult {
    success: boolean;
    error?: string;
    authType?: 'biometric' | 'pin' | 'pattern' | 'none';
}

/**
 * Reusable authentication utility for biometric/PIN/Pattern auth
 * Works across iOS and Android with automatic fallback to device credentials
 */
export const authenticateUser = async (
    options: AuthenticationOptions = {}
): Promise<AuthenticationResult> => {
    const {
        purpose = 'view-password',
        customMessage,
        showSuccessToast = false,
        successMessage,
    } = options;

    try {
        // Step 1: Check if device has authentication hardware
        const compatible = await LocalAuthentication.hasHardwareAsync();

        if (!compatible) {
            Alert.alert(
                'Authentication Not Available',
                'Your device does not support biometric or PIN authentication.',
                [{text: 'OK'}]
            );
            return {
                success: false,
                error: 'Device does not support authentication',
                authType: 'none'
            };
        }

        // Step 2: Check if user has set up any authentication
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!enrolled) {
            Alert.alert(
                'Authentication Not Set Up',
                'Please set up Face ID, Fingerprint, or PIN in your device settings to continue.',
                [{text: 'OK'}]
            );
            return {
                success: false,
                error: 'No authentication method enrolled',
                authType: 'none'
            };
        }

        // Step 3: Get available authentication types
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        // Determine authentication type and message
        let authType: 'biometric' | 'pin' = 'pin';
        let authMessage = customMessage || getDefaultMessage(purpose);

        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            authType = 'biometric';
            authMessage = customMessage || `Use Face ID to ${getPurposeAction(purpose)}`;
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            authType = 'biometric';
            authMessage = customMessage || `Use fingerprint to ${getPurposeAction(purpose)}`;
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
            authType = 'biometric';
            authMessage = customMessage || `Use iris scan to ${getPurposeAction(purpose)}`;
        } else {
            authMessage = customMessage || `Use PIN or pattern to ${getPurposeAction(purpose)}`;
        }

        // Step 4: Perform authentication
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: authMessage,
            fallbackLabel: 'Use device passcode',
            cancelLabel: 'Cancel',
            disableDeviceFallback: false, // CRITICAL: Allow PIN/Pattern fallback
        });

        if (result.success) {
            // Show success toast if requested
            if (showSuccessToast) {
                showToast.success(
                    'Authenticated ✓',
                    successMessage || 'Authentication successful'
                );
            }

            return {
                success: true,
                authType
            };
        } else {
            // User cancelled or authentication failed
            return {
                success: false,
                error: 'Authentication failed or cancelled',
                authType
            };
        }

    } catch (error: any) {
        console.error('Authentication error:', error);
        showToast.error('Authentication Error', 'Something went wrong');

        return {
            success: false,
            error: error?.message || 'Unknown error',
            authType: 'none'
        };
    }
};

/**
 * Get user-friendly action text based on purpose
 */
const getPurposeAction = (purpose: AuthPurpose): string => {
    switch (purpose) {
        case 'view-password':
            return 'view password';
        case 'copy-password':
            return 'copy password';
        case 'edit-password':
            return 'edit password';
        case 'save-password':
            return 'save password';
        case 'delete-password':
            return 'delete password';
        case 'enable-password':
            return 'enable password storage';
        case 'access-settings':
            return 'access settings';
        default:
            return 'continue';
    }
};

/**
 * Get default authentication message
 */
const getDefaultMessage = (purpose: AuthPurpose): string => {
    return `Authenticate to ${getPurposeAction(purpose)}`;
};

/**
 * Quick check if biometric/PIN is available (no alerts)
 */
export const isAuthenticationAvailable = async (): Promise<boolean> => {
    try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        return compatible && enrolled;
    } catch {
        return false;
    }
};

/**
 * Get readable authentication type name
 */
export const getAuthenticationTypeName = async (): Promise<string> => {
    try {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            return 'Face ID';
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            return 'Fingerprint';
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
            return 'Iris Scan';
        } else {
            return 'PIN or Pattern';
        }
    } catch {
        return 'Device Authentication';
    }
};