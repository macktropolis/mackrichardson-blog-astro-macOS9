---
title: Improving New Feature Deployment in FileMaker with Feature Flags
date: 2023-08-08
author: Mack Richardson
image:
  {
    src: "../../assets/blog/feature-flags-in-filemaker.jpg",
    alt: "",
  }
description: Discover the power of feature flags, a dynamic technique that empowers developers to control specific functionalities within applications with ease.
draft: false
category: FileMaker
tags: ["feature flags"]  # Add tags here
---

Feature flags are a powerful technique used in software development to enable or disable certain features within an application. They provide developers with the ability to control the availability of specific functionalities without the need for frequent code deployments or conditional logic.

In FileMaker Pro, feature flags are a great way of isolating script code from users while it's in development and testing. This article uses a global variable to store a carriage return-delimited list of feature flags that are currently enabled.

## But First, a Custom Function

First, write a custom function, named `env.featureFlag`, with the following code:

```
$$~listFeatureFlags
```

This is a very simple custom function. The `env.featureFlag` function does not require any parameters. It retrieves the list of enabled feature flags from the `$$~listFeatureFlags` global variable.

### Why Use a Custom Function instead of the Global Variable?

Using a custom function makes checking which feature flags are active more flexible and easier to maintain. Here are a couple of benefits of using the custom function:

1. When writing calculations that reference the feature flags list global variable, custom functions can be referenced in the calculation editor through auto-complete and the functions list. This reduces the chance of errors if mistyping or misremembering the variable name.
2. If the feature flags global variable name is changed in the future, only the custom function needs to be updated rather than every script that references the variable.

## Implementation

### General Scripts

To use Feature Flags, create two new scripts for toggling flags on and off.

1. `Enable Feature Flag ( featureFlag ) `

```
Set Variable [ $featureFlag ; Value: script.getParameter ( "featureFlag" ) ] 

Set Variable [ $$~listFeatureFlags ; Value: If ( list.hasValue ( env.featureFlags ; $featureFlag ) ; env.featureFlags // Do Nothing /** ELSE **/ ; List ( env.featureFlags ; $featureFlag ) ) ] 

Refresh Window [] 
```

2. `Disable Feature Flag ( featureFlag ) `

```
Set Variable [ $featureFlag ; Value: script.getParameter ( "featureFlag" ) ] 

Set Variable [ $$~listFeatureFlags ; Value: If ( list.hasValue ( env.featureFlags ; $featureFlag ) ; Substitute ( ¶ & env.featureFlags &  ¶ ; [ ¶ & $featureFlag & ¶ ; "" ] ) // Do Nothing /** ELSE **/ ; env.featureFlags ) ] 

Refresh Window []
```

 These scripts take the name of a feature flag and add (enable) or remove (disable) it from the `$$~listFeatureFlags` global variable.

### Specific Feature Flags Scripts

Next, create 2 scripts for each feature flag. One will enable the flag. The other will disable the flag. Here is an example of each script for a feature named, `newFeature.v1`:

1. `ENABLE: New Feature ( newFeature.v1 ) `

```
Set Variable [ $featureFlag ; Value: "newFeature.v1" ] 

Set Variable [ $~trigger ; Value: JSONSetElement (  "" ;  [ "featureFlag" ; $featureFlag ; JSONString ] ) ] 

Perform Script [ Specified: From list ; “Enable Feature Flag ( featureFlag )” ; Parameter: $~trigger ]
```

2. `DISABLE: New Feature ( newFeature.v1 ) `

```
Set Variable [ $featureFlag ; Value: "newFeature.v1" ] 

Set Variable [ $~trigger ; Value: JSONSetElement ( "" ; [ "featureFlag" ; $featureFlag ; JSONString ] ) ] 

Perform Script [ Specified: From list ; “Disable Feature Flag ( featureFlag )” ; Parameter: $~trigger ]
```

With these two scripts, this new feature can be turned on or off using a number of methods, including:

1. a start-up script which toggles new features on or off when the file is opened.
2. attach the script to a button which can be hidden
3. call the script from within other scripts.

The options are almost endless.

## Usage

Now it's time to incorporate feature flags into scripts where you want the to conditionally use the new feature.

Within a script that will use the new feature, use the `If` script step with the following condition:

```
If [ list.hasValue ( env.featureFlags ; "newFeature.v1" ) ]
	# Do something only if the feature flag has been enabled.
End If
```

- Replace `newFeature.v1` with the name of the feature flag you want to check.
- The `list.hasValue` function checks if the specified feature flag exists in the enabled feature flags list.

By incorporating this code snippet into your scripts, you can selectively execute certain actions based on the status of a feature flag. This provides you with a convenient way to control the behavior of your FileMaker Pro solution dynamically.

## Implementation Considerations

When using feature flags in FileMaker Pro, keep these considerations in mind:

1. **Feature Flag Naming**: Use descriptive and intuitive names for your feature flags to ensure clarity and ease of understanding.

2. **Flag Management**: Maintain a centralized and well-documented list of feature flags and their purposes. This will help ensure consistency and simplify future updates.

3. **Testing and Validation**: Before deploying your solution, thoroughly test each feature flag to verify its functionality and intended behavior. This is crucial to avoid unintended consequences or conflicts with other parts of your application.

4. **Communication and Collaboration**: Communicate the purpose and status of feature flags effectively with your users, especially users who will get the new functionality. This promotes collaboration, enables seamless integration of new features, and ensures everyone understands the current state of the application.

## Conclusion

Feature flags offer FileMaker Pro developers a flexible and efficient way to manage the availability of specific functionalities within their solutions. With the `env.featureFlag` custom function, controlling feature flags becomes straightforward, allowing you to adapt your application's behavior without complex conditional logic or frequent code deployments. By leveraging this technique, you can build more adaptable and dynamic FileMaker Pro solutions, providing a better user experience and facilitating agile development practices.

Remember to use feature flags judiciously, maintain clear documentation, and conduct thorough testing to ensure a smooth implementation.

*Note: The Feature Flag methodology outlined in this article was introduced at Codence by [Cristos Lianides-Chin](https://www.codence.com/filemaker-developers/team).*

Keep on FileMakin'.