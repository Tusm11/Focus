# Deploy Focus on Streamlit Cloud

## Quick Start

### 1. Install Streamlit Locally (Optional)

```bash
pip install -r requirements.txt
streamlit run app.py
```

Visit `http://localhost:8501` in your browser.

### 2. Deploy to Streamlit Cloud

#### Step 1: Push to GitHub
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Add Streamlit web app"
git push origin main
```

#### Step 2: Create Streamlit Account
1. Go to https://streamlit.io/cloud
2. Click "Sign up"
3. Sign in with GitHub

#### Step 3: Deploy App
1. Click "New app"
2. Select your GitHub repository
3. Select branch: `main`
4. Set main file path: `app.py`
5. Click "Deploy"

#### Step 4: Share Your App
Once deployed, you'll get a URL like:
```
https://focus-app-yourname.streamlit.app
```

Share this link with anyone!

## Features

✅ **Dashboard** - View player stats, XP, pet status
✅ **Focus Sessions** - Start sessions and earn rewards
✅ **Quests** - Create and track productivity goals
✅ **Character** - Manage class, skills, and progression
✅ **Real-time Updates** - All changes saved instantly

## How It Works

1. **Set Entertainment Time** - Choose how long to browse
2. **Set Focus Duration** - Choose focus session length
3. **Start Session** - Click "Start Session"
4. **Earn Rewards** - Get XP, gold, and pet happiness
5. **Level Up** - Unlock skill points and new abilities

## Customization

### Change Colors
Edit the CSS in `app.py`:
```python
st.markdown("""
    <style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    </style>
""", unsafe_allow_html=True)
```

### Add More Features
- Add boss battles
- Add achievements
- Add leaderboards
- Add data persistence (database)

## Troubleshooting

### App won't load
- Check `requirements.txt` has all dependencies
- Check `app.py` has no syntax errors
- View logs in Streamlit Cloud dashboard

### Data not persisting
- Streamlit Cloud resets session state on refresh
- To persist data, add a database (Firebase, Supabase, etc.)

### Performance issues
- Optimize with `@st.cache_data` decorator
- Reduce number of widgets
- Use columns for layout

## Next Steps

1. **Add Database** - Use Firebase or Supabase for data persistence
2. **Add Authentication** - Let users create accounts
3. **Add Leaderboards** - Compare with other players
4. **Add Notifications** - Remind users to focus
5. **Mobile App** - Create React Native version

## Resources

- [Streamlit Docs](https://docs.streamlit.io)
- [Streamlit Cloud](https://streamlit.io/cloud)
- [Streamlit Components](https://streamlit.io/components)

---

**Your Focus app is now live!** 🚀
