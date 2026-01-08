/**
 * pi-pai - Personal AI Infrastructure Extension for pi-mono
 * Version: 1.4.0
 */
export declare const extensionName = "pi-mono-pai";
export declare const version = "1.4.0";
export declare const awesomePaiAgentIntegration = true;
export interface PAIContext {
    current: string;
    desired: string;
    gap: string[];
}
export declare class PersonalAIInfrastructure {
    readonly version = "1.4.0";
    readonly extensionName = "pi-mono-pai";
    readonly awesomePaiAgentIntegration = true;
    initialize(): Promise<void>;
    getStatus(): any;
}
export declare const pai: PersonalAIInfrastructure;
