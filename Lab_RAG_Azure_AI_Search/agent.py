import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.projects.models import AzureAISearchTool, ConnectionType
from dotenv import load_dotenv

load_dotenv()
project_connection_string = os.getenv("PROJECT_CONNECTION_STRING")
model = os.getenv("MODEL_DEPLOYMENT_NAME")
index_name=os.getenv("AI_SEARCH_INDEX_NAME")

def run_agent(user_message: str) -> str:
    project_client = AIProjectClient.from_connection_string(
        credential=DefaultAzureCredential(),
        conn_str=project_connection_string,
    )

    # Find Azure AI Search connection
    conn_list = project_client.connections.list()
    conn_id = ""
    for conn in conn_list:
        if conn.connection_type == ConnectionType.AZURE_AI_SEARCH:
            conn_id = conn.id
            break

    ai_search = AzureAISearchTool(index_connection_id=conn_id, index_name=index_name)

    with project_client:
        agent = project_client.agents.create_agent(
            model=model,
            name="ai-search-assistant",
            instructions="You are a helpful assistant",
            tools=ai_search.definitions,
            tool_resources=ai_search.resources,
            headers={"x-ms-enable-preview": "true"},
        )

        thread = project_client.agents.create_thread()

        # Use the user_message instead of hardcoded content
        project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=user_message,
        )

        run = project_client.agents.create_and_process_run(thread_id=thread.id, assistant_id=agent.id)

        if run.status == "failed":
            project_client.agents.delete_agent(agent.id)
            return f"Run failed: {run.last_error}"

        # Fetch messages and extract assistant's response
        messages = project_client.agents.list_messages(thread_id=thread.id)
        assistant_response = ""
        for msg in messages.data:
            if msg.role == "assistant":
                assistant_response = msg.content[0].text.value
                break

        # Clean up
        project_client.agents.delete_agent(agent.id)

        return assistant_response or "Sorry, I couldn't generate a response."


# response = run_agent("What are the hotels offered by Margie's Travel in Las Vegas?")
# print(response)