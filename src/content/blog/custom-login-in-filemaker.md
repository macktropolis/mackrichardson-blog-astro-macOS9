---
title: Crafting a Custom Login for FileMaker Solutions
date: 2023-04-05
author: Mack Richardson
image:
  {
    src: "../../assets/blog/custom-login-in-filemaker.jpg",
    alt: "",
  }
description: Build a flexible login routine that can be themed to fit the UI for any solution, and also provide useful information and feedback to the user.
draft: false
category: FileMaker
tags: ["login", "security", "ui", "ux"]  # Add tags here
---

One of the *(many)* things I love about the FileMaker platform is the wide array of tools it gives developers to build beautiful, useful user interfaces. Unfortunately, you only get one chance to make a first impression. For countless users, this sparse *(and less helpful than it should be)*, log in dialog box is their first interaction with FileMaker...

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_12-04-33.png" class="center" alt="" />

..but it doesn't have to be. It could be so much better!

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_22-37-47.gif" class="center" alt="" />

## FileMaker Saves FileMaker

As with most FileMaker problems, the solution lies in FileMaker. With the `[Guest]` account, `Re-Login`, and `Create Account` script steps and a bit of script scaffolding, we can build a flexible login routine that can be themed to fit the UI for any solution, as well as, provide useful information and feedback to the user.

Let's have a look at what we'll need to make this work.

### Security Settings

Let's start with the Security Settings we'll need. Open the `Security Manager` and click the `Advanced Settings` button.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_18-50-53.gif" class="center" alt="" />

Duplicate the `Read-Only` Privilege Set and uncheck everything under Other Privileges except `Disconnect user from server when idle` and click the `OK` button.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_13-49-42.png" class="center" alt="" />

Now, in the `Security Manager`, activate the `Guest` user account (if it isn't already active) and assign it the `Restricted Access` Privilege Set we just created. Click the `OK` button and close the `Security Manager`.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_13-51-02.png" class="center" alt="" />

Open the `File Options` for the FileMaker file, turn on the `Log in using:` option and select `Guest Account`. Now every time the file is opened the restricted guest account will be used.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_17-06-09.png" class="center" alt="" />

Our security settings are all set up and we're ready to start building our database.

### Fields

You'll need two global fields to capture the username and password data to be passed during the `Re-Login` or `Create Account`. I named these fields `user_USERNAME` and `user_PASSWORD` but feel free to use your own naming convention.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_19-39-04.png" class="center" alt="" />

In this example, I'm only capturing the username and password to log in or create a new account but you could create an entire bank of fields if you needed to capture more user information (e.g. full name, email address, etc.) to store in a `Users` table.

Note: You may have noticed the `user_PASSWORD` field has two repetitions. This second repetition will be used when creating a new account to compare the user's password entry to prevent unintentional typos. If you do not plan on allowing new users to create an account in your solution, this repetition is unnecessary.

### Layouts

Now, in Layout Mode, create a layout that will be called whenever the first window is opened.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_19-54-13.png" class="center" alt="" />

If you allow new users to create an account, you will also need a layout to capture and validate the username and password entries.

<img src="/assets/images/blog/2023-04-05-crafting-visually-striking-and-customizable-login-for-fileMaker/2023-03-30_19-54-49.png" class="center" alt="" />

### Scripts

Now let's wire our components together into a cohesive log in routine. I use a `Startup` script which is triggered `OnFirstWindowOpen` as the wrapper for this routine.

```
# Startup

Set Error Capture [ On ]
# 
# ---------[ BYPASS THE STARTUP SCRIPT IF RUNNING ON THE SERVER ]---------
If [ LeftWords ( Get ( ApplicationVersion ); 1) = "Server" ] 
	Exit Script [ Text Result: $null ] 
End If
# 
# ---------[ CHECK FOR SCRIPT PARAMETERS ]---------
Set Variable [ $param ; Value: Get(ScriptParameter) ] 
If [ not IsEmpty ( $param ) ] 
	Set Variable [ $action ; Value: JSONGetElement ( $param ; "action" ) ] 
	Set Variable [ $context ; Value: JSONGetElement ( $param ; "context" ) ] 
End If
# 
# ---------[ BYPASS THE STARTUP SCRIPT IF RUNNING ON THE SERVER ]---------
If [ IsEmpty ( $param ) 		// if there is no incoming script parameter, this is a first time login ] 
	# 
	Perform Script [ Specified: From list ; “Hide Toolbars” ; Parameter:    ]
	Perform Script [ Specified: From list ; “Flexible Log In” ; Parameter:    ]
	Perform Script [ Specified: From list ; “1.0” ; Parameter:    ]
	Perform Script [ Specified: From list ; “Initialize System Vars” ; Parameter:    ]
	Perform Script [ Specified: From list ; “Loading Window” ; Parameter:    ]
	# 
	Set Variable [ $$~loginWindowTitle ; Value: $$@_APP.NAME & " Login" ] 
	# 
	# 
	# ---------[ CHECK IF USER IS GUEST AND PROMPT USER TO LOGIN WITH ACCOUNT ]---------
	If [ Get( AccountName ) = "[Guest]" ] 
		Set Field [ GLOBALS::user_USERNAME ; "" ] 
		Set Field [ GLOBALS::user_PASSWORD ; "" ] 
		Set Field [ GLOBALS::user_PASSWORD[2] ; "" ] 
		New Window [ Style: Card ; Name: $$~loginWindowTitle ; Using layout: “Login” (GLOBALS) ] 
		Adjust Window [ Resize to Fit ]
		Go to Next Field
		Exit Script [ Text Result:    ] 
	End If
	# 
End If
# End If [ not $param ]
# 
# 
# ---------[ CLOSE THE LOGIN WINDOW OR PERFORM SUBSCRIPTS ]---------
If [ $context = "login" and $action = "create" ] 
	Perform Script [ Specified: From list ; “ - Startup | New Account and Login” ; Parameter:    ]
Else If [ $context = "login" and $action = "login" ] 
	Perform Script [ Specified: From list ; “ - Startup | Login” ; Parameter: JSONSetElement (  	"" 	; [ "action" ; "login" ; JSONString ] 	; [ "context" ; "login" ; JSONString ] ) ]
End If
# 
# 
# // Pass parameters from the previous subscript result
Set Variable [ $param ; Value: "" ] 
Set Variable [ $param ; Value: Get(ScriptResult) ] 
If [ not IsEmpty ( $param ) ] 
	Set Variable [ $action ; Value: JSONGetElement ( $param ; "action" ) ] 
	Set Variable [ $context ; Value: JSONGetElement ( $param ; "context" ) ] 
End If
# 
# 
# ---------[ RESET THE USER VARIABLES AFTER RELOGIN ]---------
Perform Script [ Specified: From list ; “Initialize System Vars” ; Parameter:    ]
If [ PatternCount ( 	WindowNames ;	$$~loginWindowTitle ) ] 
	Close Window [ Name: $$~loginWindowTitle ; Current file ] 
End If
Set Variable [ $$~loginWindowTitle ] 
# 
# ---------[ RESET GLOBAL FIELDS AFTER RELOGIN ]---------
Set Field [ GLOBALS::user_USERNAME ; "" ] 
Set Field [ GLOBALS::user_PASSWORD ; "" ] 
Set Field [ GLOBALS::user_PASSWORD[2] ; "" ] 
# 
New Window [ Style: Document ; Using layout: “Technique Form” (ExampleTemplate) ] 
Close Window [ Name: "Loading..." ; Current file ] 
Set Window Title [ Current Window ; New Title: $$@_APP.NAME ] 
# 
# 
Adjust Window [ Resize to Fit ]
Move/Resize Window [ Current Window ; Top: WindowCenter ( "vertical" ) ; Left: WindowCenter ( "horizontal" ) ] 
# 
Exit Script [ Text Result: $null ] 
```

When this script runs, it checks if the current account is `[Guest]`. If it is, it triggers a log in subroutine which does the heavy lifting of login.

```
#  - Startup | Login

Set Error Capture [ On ]
Allow User Abort [ Off ]
# 
# ---------[ CHECK FOR ANY SCRIPT PARAMETERS ]---------
Set Variable [ $param ; Value: Get(ScriptParameter) ] 
Set Variable [ $action ; Value: JSONGetElement ( $param ; "action" ) ] 
Set Variable [ $context ; Value: JSONGetElement ( $param ; "context" ) ] 
# 
# ---------[ VALIDATE USER DATA ENTRY ]---------
If [ IsEmpty ( GLOBALS::user_USERNAME ) or IsEmpty ( GLOBALS::user_PASSWORD ) ] 
	Set Variable [ $errorMessage ; Value: "Missing Username / Password" ] 
	Beep
	Show Custom Dialog [ $errorMessage ; "Login could not be completed. Please enter a username and password." ] 
	Halt Script
Else
	# ---------[ PASS THE ENTERED USERNAME AND PASSWORD TO RE-LOGIN AND VALIDATE ]---------
	Re-Login [ Account Name: GLOBALS::user_USERNAME ; Password: •••••••• ; With dialog: Off ] 
	Set Variable [ $error ; Value: x.error ] 
	If [ $error ] 
		Beep
		Show Custom Dialog [ x.errorMessage ( $error ) ; "Login could not be completed. Please check your username and password. " & x.errorMessage ( $error… ] 
		Halt Script
	End If
End If
# 
# ---------[ PASS VALIDATION PARAMETERS BACK INTO THE CALLING SCRIPT ]---------
Exit Script [ Text Result: JSONSetElement (  	"" 	; [ "action" ; "validate" ; JSONString ] 	; [ "context" ; "login" ; JSONString ] ) ] 
```

This script checks to make sure the user has filled in the required fields, username, and password. The values are then passed to the `Re-Login` script step. If the `Re-Login` completes successfully, validation parameters are passed back up to the `Startup` script. Otherwise, the user is warned about the failure and the script is halted.

If you're allowing new account creation, you'll need a second script to take user data and create a new `Data Entry Only` or `Read-Only` account. 

```
#  - Startup | New Account and Login

Set Error Capture [ On ]
Allow User Abort [ Off ]
# 
# ---------[ CHECK IF THE USERNAME OR PASSWORD OR CONFIRM PASSWORD FIELDS ARE EMPTY ]---------
If [ IsEmpty ( GLOBALS::user_USERNAME ) or IsEmpty ( GLOBALS::user_PASSWORD ) or IsEmpty ( GetRepetition (  GLOBALS::user_PASSWORD ; 2 ) ) ] 
	#  
	Beep
	Show Custom Dialog [ "Username / Password required" ; "Please enter a Username and Password to create a new login." ] 
	Halt Script
	# 
	# ---------[ CHECK IF THE PASSWORD AND CONFIRM PASSWORD MATCH ]---------
Else If [ Get(LayoutName) = "New Account Setup" and ( GLOBALS::user_PASSWORD <> GetRepetition ( GLOBALS::user_PASSWORD ; 2 ) ) ] 
	#  
	Beep
	Show Custom Dialog [ "Passwords do not match" ; "The passwords do not match. Please re-enter your desired password." ] 
	Halt Script
	# 
Else
	# ---------[ CREATE A NEW DATA ENTRY ONLY ACCOUNT USING THE PROVIDED USERNAME AND PASSWORD ]---------
	Add Account [ Account Name: Trim ( GLOBALS::user_USERNAME ) ; Password: •••••••• ; Privilege Set: [Data Entry Only] ] 
	# 
	# ---------[ TRAP FOR ERROR CREATING ACCOUNT ]---------
	Set Variable [ $error ; Value: x.error ] 
	If [ not $error ] 
		#  
		# ---------[ RE-LOGIN USING THE ACCOUNT JUST CREATED ]---------
		Re-Login [ Account Name: GLOBALS::user_USERNAME ; Password: •••••••• ; With dialog: Off ] 
		Set Variable [ $error ; Value: x.error ] 
		# 
		# ---------[ TRAP FOR ERROR LOGGING IN USING NEW ACCOUNT ]---------
		If [ $error ] 
			#  
			Beep
			Show Custom Dialog [ x.errorMessage ( $error ) ; "Login could not be completed. Please check your username and password. " & x.errorMessage ( $error… ] 
			Halt Script
			# 
		End If
	Else
		Beep
		Show Custom Dialog [ x.errorMessage ( $error ) ; "There was an error creating your user account. Please try again. " & x.errorMessage ( $error ) ] 
		Halt Script
		# 
	End If
End If
# 
# ---------[ PASS VALIDATION PARAMETERS BACK INTO THE CALLING SCRIPT ]---------
Exit Script [ Text Result: JSONSetElement (  	"" 	; [ "action" ; "login" ; JSONString ] 	; [ "context" ; "login" ; JSONString ] ) ] 
# 
```

NOTE: If you're using the new account creation option, you'll want to give some thought to limiting record access to the record's creation account. The security model for cross-record access would need to be defined before building the system.

### Final Thoughts

Now you've got the framework to build a beautiful and flexible log-in routine. With this routine, you can give your users more instructive text, a unified interface, and an all-around nicer experience.

A demo file of how the log-in routine works, is included with this post. Please get under the hood and see how it works in detail. I can't wait to see what amazing things are done with routine. If you have questions or suggestions, please email me at mack.richardson@codence.com.

Keep on FileMakin'.