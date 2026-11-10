package uz.shakhboz.todo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.shakhboz.todo.dto.TodoRequest;
import uz.shakhboz.todo.model.Todo;
import uz.shakhboz.todo.repository.TodoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getAll() {
        return todoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Todo> create(@RequestBody TodoRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Todo todo = new Todo(request.getTitle().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(todoRepository.save(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(@PathVariable Long id, @RequestBody TodoRequest request) {
        return todoRepository.findById(id)
                .map(todo -> {
                    if (request.getTitle() != null && !request.getTitle().isBlank()) {
                        todo.setTitle(request.getTitle().trim());
                    }
                    if (request.getCompleted() != null) {
                        todo.setCompleted(request.getCompleted());
                    }
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
