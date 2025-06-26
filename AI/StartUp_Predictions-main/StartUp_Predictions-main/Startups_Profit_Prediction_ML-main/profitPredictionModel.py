#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# IMPORTANT: RUN THIS CELL IN ORDER TO IMPORT YOUR KAGGLE DATA SOURCES,
# THEN FEEL FREE TO DELETE THIS CELL.
# NOTE: THIS NOTEBOOK ENVIRONMENT DIFFERS FROM KAGGLE'S PYTHON
# ENVIRONMENT SO THERE MAY BE MISSING LIBRARIES USED BY YOUR
# NOTEBOOK.
import kagglehub
karthickveerakumar_startup_logistic_regression_path = kagglehub.dataset_download('karthickveerakumar/startup-logistic-regression')

print('Data source import complete.')


# <a id="Import"></a>
# # <p style="background-color: #0093af; font-family:Pacifico; color:#ffffff; font-size:200%; font-family:Pacifico; text-align:center; border-radius:1000px 50px;">Startups Profit Prediction Model</p>

# # <font size= '6' color='DodgerBlue'>▶ Table Of Contents</font>

# * [1. Importing Libraries](#1)
# * [2. Load & Understand the dataset](#2)
# * [3. Handling Missing Values](#3)
# * [4. Handling Outliers](#4)
# * [5. Splitting The Dataset](#5)
# * [6. Feature Scaling](#6)
# * [7. Training our Machine Learning Model](#7)
# * [8. Plotting the performance of the model](#8)
# * [9. Evaluation the model](#9)

# <a id="1"></a>
# # <font size= '6' color='DodgerBlue'>▶ Importing Libraries</font>

# In[ ]:


# Data Science Tools
import numpy as np
import pandas as pd

# Data Visualization Tools
import matplotlib.pyplot as plt
import seaborn as sns
get_ipython().system('pip install sweetviz')
import sweetviz as sv
import time

# Scikit-Learn Library
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Evaluation Metric Libraries
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Warnings
import warnings
warnings.filterwarnings('ignore')


# <a id="2"></a>
# # <font size= '6' color='DodgerBlue'>▶ Load & Understand The Dataset</font>

# In[ ]:


Data = pd.read_csv("/kaggle/input/startup-logistic-regression/50_Startups.csv")

# Comma-Separated Values (CSV)
# Age  ,  Name     ,  Target
# 21   ,  John     ,   200
# 22   ,  Sara     ,   500
# 23   ,  Olivia   ,   700


# In[ ]:


Data.shape # Dimensions (rows, columns) "Attribute"


# In[ ]:


Data.head(10) # first 10 rows/records  "Method"


# In[ ]:


Data.tail(10) # last 10 rows/records  "Method"


# In[ ]:


Data.columns  # "Attribute"


# In[ ]:


Data.dtypes  # "Attribute"


# In[ ]:


Data.dtypes.value_counts().plot.pie(explode=[0.1,0.1], autopct="%1.1f%%", shadow=True)
plt.title("Type Of Our Data");


# In[ ]:


Data.info()  # "Method"


# In[ ]:


Data.describe().style.background_gradient(cmap="Blues")  # "Method"


# In[ ]:


My_Report = sv.analyze(Data)


# In[ ]:


My_Report.show_notebook(w=None, h=None, scale=None, layout="widescreen", filepath=None)


# <a id="3"></a>
# # <font size= '6' color='DodgerBlue'>▶ Handling Missing Values</font>

# In[ ]:


if Data.isnull().values.any():
    print("Unfortunately, there are missing values in the dataset\n")
else:
    print("Fortunately, there aren't missing values in the dataset.")


# **Analysis and exploration of categories of the "State" feature**

# In[ ]:


# check labels in "State" feature

Data["State"].unique()


# In[ ]:


Data["State"].value_counts()

# (0) => California
# (1) => Florida
# (2) => New York


# In[ ]:


# Set the figure size
plt.figure(figsize=(18, 6))

# First Subplot
Left_Shape = plt.subplot(1, 2, 1)
sns.countplot(x="State", data=Data)
Left_Shape.bar_label(Left_Shape.containers[0])
Left_Shape.set_title("State", fontsize=20)

# Second Subplot
Right_Shape = plt.subplot(1, 2, 2)
Data["State"].value_counts().plot.pie(explode=[0.1, 0.1, 0.1], autopct="%1.2f%%", shadow=True)
Right_Shape.set_title(label="State", fontsize=50, color="Red", font="Lucida Calligraphy")

plt.tight_layout()
plt.show()

# (0) => California
# (1) => Florida
# (2) => New York


# In[ ]:


# Label Encoding
Data["State"].replace({"California":0, "Florida":1, "New York":2}, inplace=True)

# (0) => California
# (1) => Florida
# (2) => New York


# <a id="4"></a>
# # <font size= '6' color='DodgerBlue'>▶ Handling Outliers</font>

# In[ ]:


# Outliers = Unusual Values

for column in Data.columns:
    if Data[column].dtype!="object":
        plt.figure(figsize=(15, 6))
        plt.subplot(2, 2, 1)
        sns.histplot(data=Data, x=column, kde=True)
        plt.ylabel("Freq")
        plt.xlabel(column)
        plt.title(f"Distribution of {column}")
        plt.subplot(2, 2, 2)
        sns.boxplot(data=Data, x=column)
        plt.ylabel(column)
        plt.title(f"Boxplot of {column}")
        plt.show()


# In[ ]:


# Z-Score Normalization
# Calculate Z-scores for each feature

Z_Scores = (Data - Data.mean()) / Data.std()
Threshold = 3    # Is a commonly used standard
Outliers = (Z_Scores > Threshold) | (Z_Scores < -Threshold)

# Check if there are any outliers
if Outliers.any().any():
    print("Outliers detected in the dataset. Removing them...")

    # Remove Outliers
    Data = Data[~Outliers.any(axis=1)]
    Data.reset_index(drop=True, inplace=True)

    print("Outliers removed. Data shape:", Data.shape)
else:
    print("No outliers detected in the dataset.")


# In[ ]:


Data.head() # Default : first 5 rows


# In[ ]:


Data.tail() # Default : last 5 rows


# In[ ]:


Data.shape # Dimensions (rows, columns)


# In[ ]:


Data.columns  # "Attribute"


# <a id="5"></a>
# # <font size= '6' color='DodgerBlue'>▶ Splitting The Dataset</font>

# In[ ]:


# X Data
X = Data.drop(["Profit"], axis=1)
print("X shape is : ", X.shape)

# y Data
y = Data["Profit"]
print("y shape is : ", y.shape)


# In[ ]:


X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=42, shuffle=True)

# Splitted Data
print("X_train shape is ", X_train.shape)
print("X_val shape is ", X_val.shape)
print("y_train shape is ", y_train.shape)
print("y_val shape is ", y_val.shape)


# <a id="6"></a>
# # <font size= '6' color='DodgerBlue'>▶ Feature Scaling</font>

# In[ ]:


# MinMaxScaler for Data

Scaler = MinMaxScaler()
X_train = Scaler.fit_transform(X_train)
X_val = Scaler.transform(X_val)


# <a id="7"></a>
# # <font size= '6' color='DodgerBlue'>▶ Training Our Machine Learning Model</font>

# **Applying "Linear Regression" Algorithm**

# In[ ]:


Model_LR = LinearRegression()
Model_LR.fit(X_train, y_train)
y_train_pred = Model_LR.predict(X_train)
y_val_pred = Model_LR.predict(X_val)


# In[ ]:


Start = time.time()
End = time.time()
Model_LR_Time = End - Start
print(f"Execution Time Of Model: {round((Model_LR_Time), 5)} Seconds\n")

# Plot And Compute Metrics
plt.figure(figsize=(12,6))
plt.scatter(range(len(y_val_pred)), y_val_pred, color="Cyan", lw=6, label="Predictions")
plt.scatter(range(len(y_val)), y_val, color="red", lw=2, label="Actual")
plt.title("Prediction Values vs Real Values (Logistic Regression)")
plt.legend()
plt.show()


# In[ ]:


Training_Data_Model_score = Model_LR.score(X_train, y_train)
print(f'Mode Score/Performance On Training Data {Training_Data_Model_score * 100:.2f}%')

Testing_Data_Model_score = Model_LR.score(X_val, y_val)
print(f'Mode Score/Performance On Testing Data {Testing_Data_Model_score * 100:.2f}%')


# <a id="8"></a>
# # <font size= '6' color='DodgerBlue'>▶ Plotting the performance of the model</font>

# In[ ]:


# Model scores for each dataset
training_score = Training_Data_Model_score
testing_score = Testing_Data_Model_score

# Define datasets and corresponding scores
datasets = ['Training Data', 'Testing Data']
scores = [training_score, testing_score]

# Plotting
plt.figure(figsize=(8, 6))
plt.bar(datasets, scores, color=['blue', 'green'])
plt.ylim(0, 1)  # Set y-axis limits to be between 0 and 1 for accuracy percentage
plt.ylabel('Accuracy')
plt.title('Model Performance on Training and Testing Data')

# Adding values on top of the bars
for i, score in enumerate(scores):
    plt.text(i, score, f'{score * 100:.2f}%', ha='center', va='bottom')

plt.show()


# <a id="9"></a>
# # <font size= '6' color='DodgerBlue'>▶ Evaluation the model</font>

# In[ ]:


# Calculating r2_score
r2_Score = r2_score(y_val_pred, y_val)
print('R2 Score Of Model is : ', r2_Score * 100)

# Calculating Mean Absolute Error
MAEValue = mean_absolute_error(y_val_pred, y_val)
print('Mean Absolute Error Value is : ', MAEValue * 100)

# Calculating Mean Squared Error
MSEValue = mean_squared_error(y_val_pred, y_val)
print('Mean Squared Error Value is : ', MSEValue * 100)



# === Save trained model to 'model.pkl' ===
import joblib
joblib.dump(model, "model.pkl")
print("Model saved as model.pkl")
