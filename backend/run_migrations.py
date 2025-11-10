"""
Script to run database migrations using Alembic programmatically
"""
import subprocess
import sys
import os
from pathlib import Path

def run_migrations():
    """
    Run alembic migrations programmatically
    """
    # Change to the backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    try:
        # Run alembic upgrade head command
        result = subprocess.run([
            sys.executable, "-c", 
            "from alembic.config import Config; "
            "from alembic import command; "
            "config = Config('alembic.ini'); "
            "command.upgrade(config, 'head')"
        ], check=True, capture_output=True, text=True)
        
        print("✅ Database migrations applied successfully!")
        print(result.stdout)
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Migration failed with error: {e}")
        print(f"Error output: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during migration: {e}")
        return False


def run_migrations_offline():
    """
    Alternative method to run migrations using alembic command if available
    """
    try:
        # Try to run alembic from the command line
        result = subprocess.run([
            "alembic", "upgrade", "head"
        ], cwd=Path(__file__).parent, check=True, capture_output=True, text=True)
        
        print("✅ Database migrations applied successfully (using alembic command)!")
        print(result.stdout)
        return True
        
    except FileNotFoundError:
        print("⚠️ Alembic command not found, trying programmatic method...")
        return run_migrations()
    except subprocess.CalledProcessError as e:
        print(f"❌ Migration failed with error: {e}")
        print(f"Error output: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during migration: {e}")
        return False


def main():
    """
    Main function to run migrations
    """
    print("🔄 Starting database migration process...")
    
    # Try both methods
    success = run_migrations_offline()
    
    if not success:
        print("❌ Failed to run migrations. Please check your database connection and configuration.")
        sys.exit(1)
    else:
        print("🎉 Migration process completed successfully!")


if __name__ == "__main__":
    main()